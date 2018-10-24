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
        private static List<BrDevice> _list { get; set; } = new List<BrDevice>();
        public List<BrDevice> List => BrDeviceStore._list;

        private Dbc _dbc;

        

        public BrDeviceStore(Dbc dbc)
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

            // パラレル実行の終了待ち
            Task.WaitAll(tasks.ToArray());

            // エンティティキャッシュ差し替え
            BrDeviceStore._list.Clear();
            BrDeviceStore._list.AddRange(entities);

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
