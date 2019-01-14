using NativeWifi;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Initializer.Models
{
    public class WifiTest
    {

        /// <summary>
        /// Converts a 802.11 SSID to a string.
        /// </summary>
        private string GetStringForSSID(Wlan.Dot11Ssid ssid)
        {
            return Encoding.ASCII.GetString(ssid.SSID, 0, (int)ssid.SSIDLength);
        }

        public void DoTest()
        {
            var a = 1;

            var hasCurrent = false;
            var currentProfileName = "";
            var currentProfileXml = "";

            WlanClient client = new WlanClient();
            var Interfaces = client.Interfaces;



            foreach (WlanClient.WlanInterface wlanIface in client.Interfaces)
            {
                Debug.WriteLine("==================================================");
                Debug.WriteLine($"Interface: {wlanIface.InterfaceName}");

                wlanIface.Scan();
                try
                {
                    var current = wlanIface.CurrentConnection;
                    hasCurrent = true;
                    currentProfileName = current.profileName;
                }
                catch (Exception)
                {
                    //throw;
                }
                
                if (hasCurrent)
                {
                    // TODO: 既存コネクションを切断するには？
                    //wlanIface.
                }


                // Lists all networks with WEP security
                Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                foreach (Wlan.WlanAvailableNetwork network in networks)
                {
                    var ssidAscii = this.GetStringForSSID(network.dot11Ssid);
                    Debug.WriteLine("--------------------");
                    Debug.WriteLine($"SSID: {ssidAscii}");
                    Debug.WriteLine($"SSID-Bytes: {BitConverter.ToString(network.dot11Ssid.SSID)}");
                    Debug.WriteLine($"NetworkConnectable: {network.networkConnectable}");
                    Debug.WriteLine($"ProfileName: {network.profileName}");
                    Debug.WriteLine($"SecurityEnabled: {network.securityEnabled}");
                    Debug.WriteLine($"WlanSignalQuality: {network.wlanSignalQuality}");
                    Debug.WriteLine($"Dot11DefaultAuthAlgorithm: {network.dot11DefaultAuthAlgorithm}");
                    Debug.WriteLine($"Dot11DefaultCipherAlgorithm: {network.dot11DefaultCipherAlgorithm}");
                }

                // Retrieves XML configurations of existing profiles.
                // This can assist you in constructing your own XML configuration
                // (that is, it will give you an example to follow).
                foreach (Wlan.WlanProfileInfo profile in wlanIface.GetProfiles())
                {
                    string name = profile.profileName; // this is typically the network's SSID
                    string xml = wlanIface.GetProfileXml(profile.profileName);
                    Debug.WriteLine("--------------------");
                    Debug.WriteLine($"ProfileXML: name = {name}");
                    Debug.WriteLine(xml);

                    if (hasCurrent)
                    {
                        if (name == currentProfileName)
                            currentProfileXml = xml;
                    }
                }


//                // Connects to a known network with WEP security
//                string profileName = "Cheesecake"; // this is also the SSID
//                string mac = "52544131303235572D454137443638";
//                string key = "hello";
//                string profileXml = $@"
//<?xml version=""1.0""?>
//<WLANProfile xmlns = ""http://www.microsoft.com/networking/WLAN/profile/v1"">
//    <name>{profileName}</name>
//    <SSIDConfig>
//        <SSID>
//            <hex>{mac}</hex>
//            <name>{profileName}</name>
//        </SSID>
//    </SSIDConfig>
//    <connectionType>ESS</connectionType>
//    <MSM>
//        <security>
//            <authEncryption>
//                <authentication>open</authentication>
//                <encryption>WEP</encryption>
//                <useOneX>false</useOneX>
//            </authEncryption>
//            <sharedKey>
//                <keyType>networkKey</keyType>
//                <protected>false</protected>
//                <keyMaterial>{key}</keyMaterial>
//            </sharedKey>
//            <keyIndex>0</keyIndex>
//        </security>
//    </MSM>
//</WLANProfile>";

//                wlanIface.SetProfile(Wlan.WlanProfileFlags.AllUser, profileXml, true);
//                wlanIface.Connect(Wlan.WlanConnectionMode.Profile, Wlan.Dot11BssType.Any, profileName);
            }
        }


        public WlanClient.WlanInterface GetInterface()
        {
            WlanClient.WlanInterface result = null;
            var importance = 0;

            WlanClient client = new WlanClient();
            var interfaces = client.Interfaces;

            // Wi-Fiインタフェースが存在しないとき、nullを返す。
            if (interfaces.Length <= 0)
                return result;


            foreach (WlanClient.WlanInterface wlanIface in interfaces)
            {
                var currentImportance = 0;

                // 接続済みのとき、重要度に10000点を加算
                try
                {
                    var current = wlanIface.CurrentConnection;
                    currentImportance += 10000;
                }
                catch (Exception)
                {
                    // 何もしない。
                }

                // プロファイル個数×1000点を、重要度に加算
                var profiles = wlanIface.GetProfiles();
                currentImportance += (profiles.Length * 1000);

                // 検知済APの信号強度(0～100)を、重要度に加算
                wlanIface.Scan();
                Wlan.WlanAvailableNetwork[] networks = wlanIface.GetAvailableNetworkList(0);
                foreach (Wlan.WlanAvailableNetwork network in networks)
                {
                    try
                    {
                        currentImportance += (int)network.wlanSignalQuality;
                    }
                    catch (Exception)
                    {
                        // 何もしない。
                    }
                }

                // 重要度が取得済みI/Fのものより大きいとき、戻り値I/Fを差し替える。
                if (importance < currentImportance)
                {
                    importance = currentImportance;
                    result = wlanIface;
                }
            }

            return result;
        }

        public Profile GetCurrentProfile(WlanClient.WlanInterface wlanInterface)
        {
            var currentProfileName = "";
            var currentProfileXml = "";

            try
            {
                var current = wlanInterface.CurrentConnection;
                currentProfileName = current.profileName;
            }
            catch (Exception)
            {
                // カレント接続が無いとき、nullを返す。
                return null;
            }

            foreach (Wlan.WlanProfileInfo profile in wlanInterface.GetProfiles())
            {
                try
                {
                    if (profile.profileName == currentProfileName)
                        currentProfileXml = wlanInterface.GetProfileXml(profile.profileName);
                }
                catch (Exception)
                {
                    // 何もしない。
                }
            }

            if (string.IsNullOrEmpty(currentProfileName) 
                || string.IsNullOrEmpty(currentProfileXml))
            {
                // プロファイル名、XMLが取得出来なかったとき
                return null;
            }

            return new Profile(currentProfileName, currentProfileXml);
        }
    }
}
