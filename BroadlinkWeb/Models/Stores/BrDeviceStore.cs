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
using SharpBroadlink.Devices;

namespace BroadlinkWeb.Models.Stores
{
    public class BrDeviceStore
    {
        private static List<SharpBroadlink.Devices.IDevice> SbDevices
            = new List<SharpBroadlink.Devices.IDevice>();
        private static IServiceProvider Provider = null;
        private static Task LoopScan = null;

        public static void SetScanner(IServiceProvider provider)
        {
            BrDeviceStore.Provider = provider;

            // 最初の一回目は同期的に行う。
            using (var serviceScope = BrDeviceStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                Xb.Util.Out("First Broadlink Device Scan");
                var store = serviceScope.ServiceProvider.GetService<BrDeviceStore>();
                store.Refresh();
            }

            // なんか違和感がある実装。
            // 代替案はあるか？
            BrDeviceStore.LoopScan = Task.Run(async () =>
            {
                // 5分に1回、LAN上のBroadlinkデバイスをスキャンする。
                while (true)
                {
                    try
                    {
                        try
                        {
                            if (BrDeviceStore.Provider == null)
                                break;
                        }
                        catch (Exception)
                        {
                            break;
                        }

                        using (var serviceScope = BrDeviceStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                        {
                            await Task.Delay(1000 * 60 * 5);

                            Xb.Util.Out("Regularly Broadlink Device Scan");
                            var store = serviceScope.ServiceProvider.GetService<BrDeviceStore>();
                            store.Refresh();
                        }
                    }
                    catch (Exception ex)
                    {
                        Xb.Util.Out(ex);
                        Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                        Xb.Util.Out("Regularly Scan FAIL!!!!!!!!!!!!");
                        //throw;
                    }
                }

                BrDeviceStore.DisposeScanner();

                Xb.Util.Out("BrDeviceStore.LoopScan Closed");
            });
        }

        public static void DisposeScanner()
        {
            BrDeviceStore.Provider = null;
        }

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

        /// <summary>
        /// LANをスキャンしてBroadlinkデバイスを取得する。
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// 起動時に1回実行、その後は5分に1回定期的に実行される。
        /// *** APIでは使わないように。重いので。***
        /// ***意図的に同期処理にしてある。async入れないで！***
        /// </remarks>
        public IEnumerable<BrDevice> Refresh()
        {
            Xb.Util.Out("BrDevicesController.Refresh");

            var result = new List<BrDevice>();

            // LAN上のBroadlinkデバイスオブジェクトを取得
            Xb.Util.Out("BrDevicesController.Refresh - Find Devices");
            var broadlinkDevices = Broadlink.Discover(2)
                .GetAwaiter()
                .GetResult();

            if (broadlinkDevices.Length <= 0)
                return new BrDevice[] { };

            // キャッシュ上に無いBroadlinkデバイスを追加。
            foreach (var sbDev in broadlinkDevices)
            {
                if (!BrDeviceStore.SbDevices.Any(sb => this.IsDeviceMatch(sb, sbDev)))
                    BrDeviceStore.SbDevices.Add(sbDev);
            }

            // DB登録済みのデバイスエンティティ取得
            var entities = this._dbc.BrDevices.ToList();

            // デバイスエンティティにBroadlinkデバイスオブジェクトをセット。
            foreach (var entity in entities)
            {
                entity.SbDevice = BrDeviceStore.SbDevices
                    .FirstOrDefault(bd => this.IsDeviceMatch(entity, bd));
            }

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

            // 認証処理終了まで待機する。
            Xb.Util.Out("BrDevicesController.Refresh - Device Auth");
            this.DelayedAuth(entities)
                .ConfigureAwait(false)
                .GetAwaiter()
                .GetResult();

            using (var serviceScope = BrDeviceStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                Xb.Util.Out("BrDevicesController.Refresh - Ensure Device's ControlSet");
                var store = serviceScope.ServiceProvider.GetService<ControlSetStore>();
                store.EnsureBrControlSets(entities)
                    .ConfigureAwait(false)
                    .GetAwaiter()
                    .GetResult();
            }

            return entities;
        }

        private async Task<bool> DelayedAuth(IEnumerable<BrDevice> entities)
        {
            foreach (var entity in entities)
            {
                if (entity.SbDevice == null)
                    continue;

                // 注)非同期で認証はNG。
                // UDPのため、要求パケットを複数一斉に送信すると、要求に応する応答パケットが
                // どのソケットからのものか判別出来ず、ちぐはぐな応答を受け取ってしまう。
                // 送信と受信を一回ずつ、順番に行う。
                Xb.Util.Out($"Auth Try: {entity.SbDevice.DeviceType}[{entity.IpAddressString}]");
                var res = await entity.SbDevice.Auth();
                Xb.Util.Out($"Auth OK?: {entity.SbDevice.DeviceType}[{entity.IpAddressString}] => {this.IsDeviceAuthed(entity.SbDevice)}");
            }

            return true;
        }

        public async Task<IDevice> RefreshDevice(IDevice device)
        {
            var index = -1;
            for (var i = 0; i < BrDeviceStore.SbDevices.Count; i++)
            {
                if (device == BrDeviceStore.SbDevices[i])
                {
                    index = i;
                    break;
                }
            }

            var newDevice = Broadlink.Create(device.DevType, device.Mac, device.Host);
            await newDevice.Auth();

            BrDeviceStore.SbDevices[index] = newDevice;

            return newDevice;
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
