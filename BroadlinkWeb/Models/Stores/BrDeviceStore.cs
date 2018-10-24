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
            // TODO: そのうちDI実装する。
            if (BrDeviceStore._instance == null)
                BrDeviceStore._instance = new BrDeviceStore();

            BrDeviceStore._instance._dbc = dbc;

            return BrDeviceStore._instance;
        }


        private Dbc _dbc;

        private List<SharpBroadlink.Devices.IDevice> _sbDevices
            = new List<SharpBroadlink.Devices.IDevice>();

        private BrDeviceStore()
        {
            Xb.Util.Out("BrDeviceStore.Constructor");
        }

        public BrDevice Get(int id)
        {
            Xb.Util.Out("BrDevicesController.Get");

            var entity = this._dbc.BrDevices
                .SingleOrDefault(bd => bd.Id == id);

            if (entity != null)
            {
                var sbDev = this._sbDevices
                    .FirstOrDefault(sd => this.IsDeviceMatch(entity, sd));

                if (sbDev == null)
                {
                    var mac = entity.MacAddressString
                        .Split('-')
                        .Select(s => (byte)Convert.ToInt32(s, 16))
                        .ToArray();
                    var ep = new IPEndPoint(IPAddress.Parse(entity.IpAddressString), entity.Port);

                    sbDev = Broadlink.Create(entity.DeviceTypeDetailNumber, mac, ep);
                }

                entity.SbDevice = sbDev;
            }

            // 注)非同期
            if (!this.IsDeviceAuthed(entity.SbDevice))
                entity.SbDevice.Auth();

            return entity;
        }


        public IEnumerable<BrDevice> GetList()
        {
            Xb.Util.Out("BrDevicesController.GetList");

            // DB登録済みのデバイスエンティティ取得
            var entities = this._dbc.BrDevices.ToList();

            foreach (var entity in entities)
            {
                var sbDev = this._sbDevices
                    .FirstOrDefault(sd => this.IsDeviceMatch(entity, sd));

                if (sbDev == null)
                {
                    var mac = entity.MacAddressString
                        .Split('-')
                        .Select(s => (byte)Convert.ToInt32(s, 16))
                        .ToArray();
                    var ep = new IPEndPoint(IPAddress.Parse(entity.IpAddressString), entity.Port);

                    sbDev = Broadlink.Create(entity.DeviceTypeDetailNumber, mac, ep);
                    this._sbDevices.Add(sbDev);
                }

                // 注)非同期
                if (!this.IsDeviceAuthed(sbDev))
                {
                    Xb.Util.Out("BrDevicesController.GetList - Auth");
                    sbDev.Auth();
                }

                entity.SbDevice = sbDev;
            }

            return entities;
        }

        public IEnumerable<BrDevice> Refresh()
        {
            Xb.Util.Out("BrDevicesController.Refresh");

            var result = new List<BrDevice>();

            // LAN上のBroadlinkデバイスオブジェクトを取得
            var broadlinkDevices = Broadlink.Discover(2)
                .GetAwaiter()
                .GetResult();

            // キャッシュ上に無いBroadlinkデバイスを追加。
            foreach (var sbDev in broadlinkDevices)
                if (!this._sbDevices.Any(sb => this.IsDeviceMatch(sb, sbDev)))
                    this._sbDevices.Add(sbDev);

            // DB登録済みのデバイスエンティティ取得
            var entities = this._dbc.BrDevices.ToList();

            // デバイスエンティティにBroadlinkデバイスオブジェクトをセット。
            foreach (var entity in entities)
                entity.SbDevice = this._sbDevices
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
            //var tasks = new List<Task>();
            //Task.WaitAll(tasks.ToArray());
            foreach (var entity in entities.Where(en => en.IsActive))
                if (!this.IsDeviceAuthed(entity.SbDevice))
                    entity.SbDevice.Auth();

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

        private bool IsDeviceMatch(SharpBroadlink.Devices.IDevice sbDev1, SharpBroadlink.Devices.IDevice sbDev2)
        {
            if (sbDev1 == null || sbDev2 == null)
                return false;

            return (sbDev1.Host.Address.ToString() == sbDev2.Host.Address.ToString()
                    && sbDev1.Host.Port == sbDev2.Host.Port
                    && sbDev1.DevType == sbDev2.DevType);
        }

        private bool IsDeviceAuthed(SharpBroadlink.Devices.IDevice sbDev)
        {
            return (sbDev.Id[0] != 0
                    || sbDev.Id[1] != 0
                    || sbDev.Id[2] != 0
                    || sbDev.Id[3] != 0);
        }
    }
}
