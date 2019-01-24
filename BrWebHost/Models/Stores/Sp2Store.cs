using BrWebHost.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace BrWebHost.Models.Stores
{
    public class Sp2Store : IDisposable
    {
        private BrDeviceStore _brDeviceStore;

        public Sp2Store([FromServices] BrDeviceStore brDeviceStore)
        {
            this._brDeviceStore = brDeviceStore;
        }


        public async Task<Sp2Status> GetStatus(int id)
        {
            var entity = await this._brDeviceStore.Get(id);

            if (entity == null)
                throw new Exception("Entity Not Found");
            else if (!entity.IsActive)
                throw new Exception("Device is not Active");
            else if (entity.SbDevice.DeviceType != DeviceType.Sp2)
                throw new Exception("Device is not SP2 Sensor");

            var sp2Dev = (Sp2)entity.SbDevice;
            var sp2Status = await sp2Dev.CheckStatus();

            var result = new Sp2Status()
            {
                Power = sp2Status.Power,
                NightLight = sp2Status.NightLight
            };

            return result;
        }

        public async Task<bool> SetStatus(int id, Sp2Status sp2Status)
        {
            // デモモードのときは実行せず正常終了する。
            if (Program.IsDemoMode)
                return true;

            var entity = await this._brDeviceStore.Get(id);

            if (entity == null)
                throw new Exception("Entity Not Found");
            else if (!entity.IsActive)
                throw new Exception("Device is not Active");
            else if (entity.SbDevice.DeviceType != DeviceType.Sp2)
                throw new Exception("Device is not SP2 Sensor");


            var sp2Dev = (Sp2)entity.SbDevice;
            var current = await sp2Dev.CheckStatus();

            if (current.Power != sp2Status.Power)
            {
                var result = await sp2Dev.SetPower(sp2Status.Power);

                if (!result)
                {
                    await this._brDeviceStore.RefreshDevice(sp2Dev);
                    throw new Exception("Set Power Failure.");
                }
            }

            if (current.NightLight != sp2Status.NightLight)
            {
                var result = await sp2Dev.SetNightLight(sp2Status.NightLight);

                if (!result)
                {
                    await this._brDeviceStore.RefreshDevice(sp2Dev);
                    throw new Exception("Set Night-Light Failure.");
                }
            }

            return true;
        }


        #region IDisposable Support
        private bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!IsDisposed)
            {
                if (disposing)
                {
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
