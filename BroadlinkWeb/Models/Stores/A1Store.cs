using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
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
        private BrDeviceStore _brDeviceStore;

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

            var result = new A1Values()
            {
                Temperature = a1Res.Temperature,
                Humidity = a1Res.Humidity,
                Voc = a1Res.AirQuality,
                Light = a1Res.Light,
                Noise = a1Res.Noise
            };

            return result;
        }
    }
}
