using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models.Entities;
using SharpBroadlink;

namespace BroadlinkWeb.Models.Stores
{
    public class BrDeviceStore
    {
        private Dbc _dbc;

        public BrDeviceStore(Dbc dbc)
        {
            this._dbc = dbc;
        }

        public IEnumerable<BrDevice> Discover()
        {
            var result = new List<BrDevice>();

            // LAN上のBroadlinkデバイスオブジェクトを取得
            var primitiveDevices = Broadlink.Discover(2)
                .GetAwaiter()
                .GetResult();

            // DB登録済みのデバイスエンティティ取得
            var registedDevices = this._dbc.BrDevices.ToList();

            // デバイスエンティティにBroadlinkデバイスオブジェクトをセット。
            foreach (var brDev in registedDevices)
                brDev.SbDevice = primitiveDevices
                    .FirstOrDefault(d => d.Host.Address.ToString() == brDev.IpAddressString);

            // DB未登録デバイスオブジェクトのEntityを生成
            var newDevices = primitiveDevices
                .Where(d => registedDevices.FirstOrDefault(bd => bd.SbDevice == d) == null)
                .Select(d => new BrDevice()
                {
                    IpAddressString = d.Host.Address.ToString(),
                    BrDeviceType = d.DeviceType.ToString(),
                    SbDevice = d
                })
                .ToArray();

            // 未登録デバイスがあれば登録
            if (newDevices.Length > 0)
            {
                registedDevices.AddRange(newDevices);
                this._dbc.AddRange(newDevices);
                this._dbc.SaveChanges();
            }

            return registedDevices;
        }
    }
}
