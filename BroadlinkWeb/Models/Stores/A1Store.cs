using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Stores
{
    public class A1Store : IDisposable
    {
        private class ValueStacker
        {
            public int DeviceId { get; set; }
            public int Count { get; set; }
            public DateTime Recorded { get; set; }
            public A1Values Sum { get; set; }
            public A1Values Avg { get; set; }

            public ValueStacker(int deviceId)
            {
                this.DeviceId = deviceId;
                this.Clear();
            }

            public void Clear()
            {
                this.Count = 0;
                this.Recorded = DateTime.Now;
                this.Sum = new A1Values()
                {
                    Temperature = 0,
                    Humidity = 0,
                    Voc = 0,
                    Light = 0,
                    Noise = 0,
                    BrDeviceId = this.DeviceId,
                    AcquiredCount = 0,
                    Created = DateTime.Now,
                    Updated = DateTime.Now
                };
                this.Avg = new A1Values()
                {
                    Temperature = 0,
                    Humidity = 0,
                    Voc = 0,
                    Light = 0,
                    Noise = 0,
                    BrDeviceId = this.DeviceId,
                    AcquiredCount = 0,
                    Created = DateTime.Now,
                    Updated = DateTime.Now
                };
            }

            public void Add(A1Values values)
            {
                this.Recorded = DateTime.Now;
                this.Count++;

                this.Sum.Temperature += values.Temperature;
                this.Sum.Humidity += values.Humidity;
                this.Sum.Voc += values.Voc;
                this.Sum.Light += values.Light;
                this.Sum.Noise += values.Noise;

                this.Avg.AcquiredCount = this.Count;
                this.Avg.Recorded = this.Recorded;
                this.Avg.Updated = this.Recorded;
                this.Avg.Temperature = this.Sum.Temperature / this.Count;
                this.Avg.Humidity = this.Sum.Humidity / this.Count;
                this.Avg.Voc = this.Sum.Voc / this.Count;
                this.Avg.Light = this.Sum.Light / this.Count;
                this.Avg.Noise = this.Sum.Noise / this.Count;
            }
        }

        private static Dictionary<int, ValueStacker> Stacker = new Dictionary<int, ValueStacker>();



        private Dbc _dbc;
        private BrDeviceStore _brDeviceStore;

        public A1Store(
            [FromServices] Dbc dbc,
            [FromServices] BrDeviceStore brDeviceStore
        )
        {
            this._dbc = dbc;
            this._brDeviceStore = brDeviceStore;
        }


        public async Task<bool> Tick()
        {
            var brs = await this._brDeviceStore.GetList();
            var entities = brs.Where(b => b.DeviceType == DeviceType.A1).ToArray();

            foreach (var entity in entities)
            {
                if (!A1Store.Stacker.ContainsKey(entity.Id))
                    A1Store.Stacker.Add(entity.Id, new ValueStacker(entity.Id));

                var stack = A1Store.Stacker[entity.Id];

                if (stack.Recorded.Hour != DateTime.Now.Hour)
                    stack.Clear();

                var record = await this.GetValues(entity.Id);
                stack.Add(record);

                if (stack.Avg.Id == default(int))
                    this._dbc.Add(stack.Avg);
                else
                    this._dbc.Entry(stack.Avg).State = EntityState.Modified;
            }
            this._dbc.SaveChanges();

            return true;
        }

        public async Task<A1Values> GetValues(int id)
        {
            var entity = await this._brDeviceStore.Get(id);

            if (entity == null)
                throw new Exception("Entity Not Found");
            else if (!entity.IsActive)
                throw new Exception("Device is not Active");
            else if (entity.SbDevice.DeviceType != DeviceType.A1)
                throw new Exception("Device is not A1 Sensor");

            var a1Dev = (A1)entity.SbDevice;
            var a1Res = await a1Dev.CheckSensorsRaw();

            // 時々取得に失敗する。Authが通っていないとか？
            if (a1Res == null)
            {
                await this._brDeviceStore.RefreshDevice(a1Dev);
                throw new Exception("Device not Ready");
            }

            var now = DateTime.Now;
            var result = new A1Values()
            {
                BrDeviceId = entity.Id,
                Temperature = (decimal)a1Res.Temperature,
                Humidity = (decimal)a1Res.Humidity,
                Voc = a1Res.AirQuality,
                Light = a1Res.Light,
                Noise = a1Res.Noise,
                Recorded = now,
                Created = now,
                Updated = now
            };

            return result;
        }

        public async Task<A1Values[]> GetHourly(int id, DateTimeRange range)
        {
            var entity = await this._brDeviceStore.Get(id);

            if (entity == null)
                throw new Exception("Entity Not Found");

            // 先に単純リストで値を取ってきて、C#上でグルーピングする。
            // EFCoreのGrouping時、SumやAverage, Countが正しくSQLにパースされない不具合があるとのこと。
            // https://github.com/aspnet/EntityFrameworkCore/issues/9722
            var values = this._dbc.A1Values
                .Where(e => e.BrDeviceId == id)
                .Where(e => range.StartDateTime <= e.Recorded && e.Recorded <= range.EndDateTime)
                .ToArray();

            var result = values
                .GroupBy(e => e.Recorded.Hour, (key, g) => new A1Values()
                {
                    BrDeviceId = id,
                    Temperature = Xb.Num.Round((decimal)g.Average(d => d.Temperature), Xb.Num.RoundType.HalfUp, 2),
                    Humidity = Xb.Num.Round((decimal)g.Average(e => e.Humidity), Xb.Num.RoundType.HalfUp, 2),
                    Voc = Xb.Num.Round((decimal)g.Average(e => e.Voc), Xb.Num.RoundType.HalfUp, 2),
                    Light = Xb.Num.Round((decimal)g.Average(e => e.Light), Xb.Num.RoundType.HalfUp, 2),
                    Noise = Xb.Num.Round((decimal)g.Average(e => e.Noise), Xb.Num.RoundType.HalfUp, 2),
                    Recorded = new DateTime(
                        g.First().Recorded.Year,
                        g.First().Recorded.Month,
                        g.First().Recorded.Day,
                        g.First().Recorded.Hour,
                        0,
                        0
                    )
                })
                .OrderBy(v => v.Recorded)
                .ToArray();


            return result;
        }

        public async Task<A1Values[]> GetDaily(int id, DateTimeRange range)
        {
            var entity = await this._brDeviceStore.Get(id);

            if (entity == null)
                throw new Exception("Entity Not Found");

            var values = this._dbc.A1Values
                .Where(e => e.BrDeviceId == id)
                .Where(e => range.StartDateTime <= e.Recorded && e.Recorded <= range.EndDateTime)
                                .ToArray();
            
            var result = values
                .GroupBy(e => e.Recorded.Day, (key, g) => new A1Values()
                {
                    BrDeviceId = id,
                    Temperature = Xb.Num.Round((decimal)g.Average(e => e.Temperature), Xb.Num.RoundType.HalfUp, 2),
                    Humidity = Xb.Num.Round((decimal)g.Average(e => e.Humidity), Xb.Num.RoundType.HalfUp, 2),
                    Voc = Xb.Num.Round((decimal)g.Average(e => e.Voc), Xb.Num.RoundType.HalfUp, 2),
                    Light = Xb.Num.Round((decimal)g.Average(e => e.Light), Xb.Num.RoundType.HalfUp, 2),
                    Noise = Xb.Num.Round((decimal)g.Average(e => e.Noise), Xb.Num.RoundType.HalfUp, 2),
                    Recorded = new DateTime(
                        g.First().Recorded.Year,
                        g.First().Recorded.Month,
                        g.First().Recorded.Day,
                        0,
                        0,
                        0
                    )
                })
                .OrderBy(v => v.Recorded)
                .ToArray();

            return result;
        }

        #region IDisposable Support
        private bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!IsDisposed)
            {
                if (disposing)
                {
                    this._dbc.Dispose();
                    this._dbc = null;

                    this._brDeviceStore.Dispose();
                    this._brDeviceStore = null;
                }

                // TODO: アンマネージド リソース (アンマネージド オブジェクト) を解放し、下のファイナライザーをオーバーライドします。
                // TODO: 大きなフィールドを null に設定します。

                IsDisposed = true;
            }
        }

        // このコードは、破棄可能なパターンを正しく実装できるように追加されました。
        public void Dispose()
        {
            this.Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}
