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
        private static BrDeviceStore _instance = null;
        public static BrDeviceStore GetInstance(Dbc dbc)
        {
            if (BrDeviceStore._instance == null)
                BrDeviceStore._instance = new BrDeviceStore(dbc);

            return BrDeviceStore._instance;
        }

        private Dbc _dbc;


        private List<BrDevice> _list = new List<BrDevice>();
        public List<BrDevice> List => this._list;

        private BrDeviceStore(Dbc dbc)
        {
            this._dbc = dbc;
        }

        public IEnumerable<BrDevice> Refresh()
        {
            var result = new List<BrDevice>();

            // LAN上のBroadlinkデバイスオブジェクトを取得
            var broadlinkDevices = Broadlink.Discover(2)
                .GetAwaiter()
                .GetResult();

            // DB登録済みのデバイスエンティティ取得
            var entities = this._dbc.BrDevices.ToList();

            // デバイスエンティティにBroadlinkデバイスオブジェクトをセット。
            foreach (var entity in entities)
                entity.SbDevice = broadlinkDevices
                    .FirstOrDefault(bd => this.IsDeviceMatch(entity, bd));

            // DB未登録デバイスオブジェクトのEntityを生成
            var newDevices = broadlinkDevices
                .Where(bd => entities.FirstOrDefault(en => this.IsDeviceMatch(en, bd)) == null)
                .Select(bd => new BrDevice()
                {
                    MacAddressString = BitConverter.ToString(bd.Mac),
                    IpAddressString = bd.Host.Address.ToString(),
                    Port = bd.Host.Port,
                    DeviceTypeDetailNumber = bd.DevType,
                    SbDevice = bd
                })
                .ToArray();

            // 未登録デバイスがあれば登録
            if (newDevices.Length > 0)
            {
                entities.AddRange(newDevices);
                this._dbc.AddRange(newDevices);
                this._dbc.SaveChanges();
            }

            // デバイスの認証を通す。
            var tasks = new List<Task>();
            foreach (var entity in entities.Where(en => en.IsActive))
                tasks.Add(entity.SbDevice.Auth());

            Task.WaitAll(tasks.ToArray());

            // エンティティキャッシュ差し替え
            this.List.Clear();
            this.List.AddRange(entities);

            return entities;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="brDev"></param>
        /// <param name="sbDev"></param>
        /// <returns></returns>
        private bool IsDeviceMatch(BrDevice brDev, SharpBroadlink.Devices.IDevice sbDev)
        {
            if (brDev == null || sbDev == null)
                return false;

            return (brDev.IpAddressString == sbDev.Host.Address.ToString()
                    && brDev.Port == sbDev.Host.Port
                    && brDev.DeviceTypeDetailNumber == sbDev.DevType);
        }
    }
}
