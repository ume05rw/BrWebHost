using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
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
    public class A1Store
    {
        private static IServiceProvider Provider = null;
        private static Task LoopRunner = null;
        private static Job _loopRunnerJob = null;

        private BrDeviceStore _brDeviceStore;


        public static void SetLoopRunner(IServiceProvider provider)
        {
            A1Store.Provider = provider;


            using (var serviceScope = A1Store.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                // ジョブを取得する。
                var jobStore = serviceScope.ServiceProvider.GetService<JobStore>();
                A1Store._loopRunnerJob = jobStore.CreateJob("A1 Sensor Recorder")
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();
            }

            // なんか違和感がある実装。
            // 代替案はあるか？
            A1Store.LoopRunner = Task.Run(async () =>
            {
                var status = new LoopJobStatus();

                var hour = DateTime.Now.Hour;
                var sumCount = 0;
                var sums = new Dictionary<int, A1Values>();
                var records = new Dictionary<int, A1Values>();


                // 1分に1回、A1デバイスの値を取得して平均値を作る。
                while (true)
                {
                    try
                    {
                        try
                        {
                            if (A1Store.Provider == null)
                                break;
                        }
                        catch (Exception)
                        {
                            break;
                        }

                        using (var serviceScope = A1Store.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                        {
                            Xb.Util.Out("Regularly A1-Sensor Record");
                            sumCount++; // カウントは1から。

                            var brStore = serviceScope.ServiceProvider.GetService<BrDeviceStore>();
                            var a1Store = serviceScope.ServiceProvider.GetService<A1Store>();
                            var dbc = serviceScope.ServiceProvider.GetService<Dbc>();

                            var brs = await brStore.GetList();
                            var a1s = brs.Where(b => b.DeviceType == DeviceType.A1).ToArray();

                            foreach (var a1 in a1s)
                            {
                                if (!sums.ContainsKey(a1.Id))
                                {
                                    sums.Add(a1.Id, new A1Values()
                                    {
                                        Temperature = 0,
                                        Humidity = 0,
                                        Voc = 0,
                                        Light = 0,
                                        Noise = 0,
                                        BrDeviceId = a1.Id,
                                        AcquiredCount = 0,
                                        Created = DateTime.Now,
                                        Updated = DateTime.Now
                                    });
                                    records.Add(a1.Id, new A1Values()
                                    {
                                        Temperature = 0,
                                        Humidity = 0,
                                        Voc = 0,
                                        Light = 0,
                                        Noise = 0,
                                        BrDeviceId = a1.Id,
                                        AcquiredCount = 0,
                                        Created = DateTime.Now,
                                        Updated = DateTime.Now
                                    });
                                }

                                var values = await a1Store.GetValues(a1.Id);

                                // 現在までの値を累積する。
                                sums[a1.Id].Temperature += values.Temperature;
                                sums[a1.Id].Humidity += values.Humidity;
                                sums[a1.Id].Voc += values.Voc;
                                sums[a1.Id].Light += values.Light;
                                sums[a1.Id].Noise += values.Noise;

                                // 累積値を取得回数で割り、平均値を取る。
                                records[a1.Id].AcquiredCount++;
                                records[a1.Id].Temperature = sums[a1.Id].Temperature / records[a1.Id].AcquiredCount;
                                records[a1.Id].Humidity = sums[a1.Id].Humidity / records[a1.Id].AcquiredCount;
                                records[a1.Id].Voc = sums[a1.Id].Voc / records[a1.Id].AcquiredCount;
                                records[a1.Id].Light = sums[a1.Id].Light / records[a1.Id].AcquiredCount;
                                records[a1.Id].Noise = sums[a1.Id].Noise / records[a1.Id].AcquiredCount;
                                records[a1.Id].Recorded = DateTime.Now;
                                records[a1.Id].Updated = DateTime.Now;

                                // 平均値をDBに記録する。
                                if (records[a1.Id].Id == default(int))
                                    dbc.A1Values.Add(records[a1.Id]);
                                else
                                    dbc.Entry(records[a1.Id]).State = EntityState.Modified;

                                await dbc.SaveChangesAsync();
                            }

                            // 1時間単位が変わったら、累積をリセットして最初から。
                            if (hour != DateTime.Now.Hour)
                            {
                                hour = DateTime.Now.Hour;
                                sumCount = 0;
                                sums = new Dictionary<int, A1Values>();
                                records = new Dictionary<int, A1Values>();
                            }

                            // ジョブ状態を記録
                            status.Count++;
                            status.StatusMessage = $"A1 Device Count: {records.Count}";
                            var json = JsonConvert.SerializeObject(status);
                            await A1Store._loopRunnerJob.SetProgress((decimal)0.5, json);

                            // 1分待機
                            await Task.Delay(1000 * 60 * 1);
                        }
                    }
                    catch (Exception ex)
                    {
                        Xb.Util.Out(ex);
                        Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                        Xb.Util.Out("Regularly Scan FAIL!!!!!!!!!!!!");
                        //throw;

                        status.Count++;
                        status.ErrorCount++;
                        status.LatestError = string.Join(" ", Xb.Util.GetErrorString(ex));
                        var json = JsonConvert.SerializeObject(status);
                        await A1Store._loopRunnerJob.SetProgress((decimal)0.5, json);
                    }
                }

                A1Store.DisposeScanner();

                Xb.Util.Out("BrDeviceStore.LoopScan Closed");
            });
        }

        public static void DisposeScanner()
        {
            A1Store.Provider = null;
        }



        public A1Store([FromServices] BrDeviceStore brDeviceStore)
        {
            this._brDeviceStore = brDeviceStore;
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
    }
}
