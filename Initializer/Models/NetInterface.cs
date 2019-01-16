using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Initializer.Models
{
    public class NetInterface
    {
        private static Dictionary<string, NetInterface> _interfaces 
            = new Dictionary<string, NetInterface>();

        public static void Init()
        {
            NetInterface._interfaces.Clear();

            var interfaces = NetworkAdapter.GetInstances();
            foreach (NetworkAdapter netif in interfaces)
            {
                //Debug.WriteLine("===== Native NIC ===============");
                //Debug.WriteLine($"Name: {netif.Name}");
                //Debug.WriteLine($"GUID: {netif.GUID}");
                //Debug.WriteLine($"MACAddress: {netif.MACAddress}");

                //// AdapterTypeId
                ////0 - イーサネット 802.3
                ////1 - トークン リング 802.5
                ////2 - ファイバー分散データ インタ - フェイス(FDDI)
                ////3 - ワイド エリア ネットワーク(WAN)
                ////4 - LocalTalk
                ////5 - DIX ヘッダー形式のイーサネット
                ////6 - ARCNET
                ////7 - ARCNET(878.2)
                ////8 - ATM
                ////9 - ワイヤレス
                ////10 - 赤外線ワイヤレス
                ////11 - Bpc
                ////12 - CoWan
                ////13 - 1394
                //Debug.WriteLine($"AdapterTypeId: {netif.AdapterTypeId}");

                var guid = netif.GUID;
                if (guid == null)
                    continue;

                var newInterface = new NetInterface(netif);
                NetInterface._interfaces.Add(guid, newInterface);
            }
        }

        public static NetInterface[] GetAll()
        {
            return NetInterface._interfaces.Values.ToArray();
        }

        public static NetInterface GetByGuid(string guid)
        {
            if (!NetInterface._interfaces.ContainsKey(guid))
                return null;

            return NetInterface._interfaces[guid];
        }


        private NetworkAdapter _adapter;

        public NetworkAdapter Adapter => this._adapter;

        public bool IsEnabled
        {
            get
            {
                if (this._adapter == null)
                    return false;

                return this._adapter.NetEnabled;
            }
        }

        public NetInterface(NetworkAdapter adapter)
        {
            this._adapter = adapter;
        }

        public bool Equals(NetInterface netInterface)
        {
            return (this._adapter.GUID == netInterface._adapter.GUID);
        }

        public void Enable()
        {
            this._adapter.Enable(); // not works
            //this.SetEnable(true);
        }

        public void Disable()
        {
            this._adapter.Disable(); // not works
            //this.SetEnable(false);
        }

        private void SetEnable(bool enable)
        {
            var interfaceName = this._adapter.Name;

            string control = (enable)
                ? "enable"
                : "disable";

            var startInfo =
                   new ProcessStartInfo("netsh", $"interface set interface \"{interfaceName}\" {control} >> C:\\dev\\tmp\\netsh.txt");

            //startInfo.CreateNoWindow = true;

            var process = new System.Diagnostics.Process();
            process.StartInfo = startInfo;

            process.Start();
            process.WaitForExit();
        }
    }
}
