using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharpBroadlink;
using Microsoft.Extensions.DependencyInjection;

namespace BroadlinkWeb.Models.Stores
{
    public class BrDeviceStore
    {
        private static List<SharpBroadlink.Devices.IDevice> SbDevices
            = new List<SharpBroadlink.Devices.IDevice>();

        public static IServiceProvider Provider = null;
        public static Task LoopScan = null;

        private Dbc _dbc;
        private ControlSetStore _controlSetStore;

        public BrDeviceStore(
            [FromServices] Dbc dbc,
            [FromServices] ControlSetStore controlSetStore
        )
        {
            Xb.Util.Out("BrDeviceStore.Constructor");
            this._dbc = dbc;
            this._controlSetStore = controlSetStore;
        }

        public async Task<BrDevice> Get(int id)
        {
            Xb.Util.Out("BrDevicesController.Get");

            var entity = await this._dbc.BrDevices
                .SingleOrDefaultAsync(bd => bd.Id == id);

            if (entity != null)
            {
                var sbDev = BrDeviceStore.SbDevices
                    .FirstOrDefault(sd => this.IsDeviceMatch(entity, sd));

                if (sbDev == null)
                {
                    var mac = entity.MacAddressString
                        .Split('-')
                        .Select(s => (byte)Convert.ToInt32(s, 16))
                        .ToArray();
                    var ep = new IPEndPoint(IPAddress.Parse(entity.IpAddressString), entity.Port);

                    sbDev = Broadlink.Create(entity.DeviceTypeDetailNumber, mac, ep);
                    BrDeviceStore.SbDevices.Add(sbDev);
                }

                entity.SbDevice = sbDev;
            }

            // 投げっぱなし、待機なし。
            this.DelayedAuth(new BrDevice[] { entity });

            return entity;
        }

        public async Task<IEnumerable<BrDevice>> GetList()
        {
            Xb.Util.Out("BrDevicesController.GetList");

            // DB登録済みのデバイスエンティティ取得
            var entities = await this._dbc.BrDevices.ToListAsync();

            foreach (var entity in entities)
            {
                var sbDev = BrDeviceStore.SbDevices
                    .FirstOrDefault(sd => this.IsDeviceMatch(entity, sd));

                if (sbDev == null)
                {
                    var mac = entity.MacAddressString
                        .Split('-')
                        .Select(s => (byte)Convert.ToInt32(s, 16))
                        .ToArray();
                    var ep = new IPEndPoint(IPAddress.Parse(entity.IpAddressString), entity.Port);

                    sbDev = Broadlink.Create(entity.DeviceTypeDetailNumber, mac, ep);
                    BrDeviceStore.SbDevices.Add(sbDev);
                }

                entity.SbDevice = sbDev;
            }

            // 投げっぱなし、待機なし。
            this.DelayedAuth(entities);

            return entities;
        }

        public async Task<IEnumerable<BrDevice>> Refresh()
        {
            Xb.Util.Out("BrDevicesController.Refresh");

            var result = new List<BrDevice>();

            // LAN上のBroadlinkデバイスオブジェクトを取得
            var broadlinkDevices = await Broadlink.Discover(2);

            // キャッシュ上に無いBroadlinkデバイスを追加。
            foreach (var sbDev in broadlinkDevices)
                if (!BrDeviceStore.SbDevices.Any(sb => this.IsDeviceMatch(sb, sbDev)))
                    BrDeviceStore.SbDevices.Add(sbDev);

            // DB登録済みのデバイスエンティティ取得
            var entities = this._dbc.BrDevices.ToList();

            // デバイスエンティティにBroadlinkデバイスオブジェクトをセット。
            foreach (var entity in entities)
                entity.SbDevice = BrDeviceStore.SbDevices
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

            // 投げっぱなし、待機なし。
            this.DelayedAuth(entities);

            return entities;
        }

        private async Task<bool> DelayedAuth(IEnumerable<BrDevice> entities)
        {
            var tasks = new List<Task>();

            foreach (var entity in entities)
            {
                if (entity.SbDevice == null)
                    continue;

                // 注)非同期で認証はNG。何故かはまだ追及してない。
                if (!this.IsDeviceAuthed(entity.SbDevice))
                {
                    //Xb.Util.Out("BrDevicesController.GetList - Auth");
                    var task = Task.Run(() => {
                        Xb.Util.Out("BrDevicesController.DelayedAuth - Auth");
                        var res = entity.SbDevice.Auth().GetAwaiter().GetResult();
                        if (!res)
                        {
                            Xb.Util.Out($"BrDevicesController.GetList - Auth Failed! {entity.IpAddressString}");
                            //throw new Exception($"BrDevicesController.GetList - Auth Failed! {entity.IpAddressString}");
                        }
                    });
                    task.ConfigureAwait(false);
                    tasks.Add(task);
                }
            }

            await Task.WhenAll(tasks.ToArray());

            return true;
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
