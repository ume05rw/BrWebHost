using NativeWifi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static NativeWifi.WlanClient;

namespace Initializer.Models
{
    public class WifiInterface
    {
        public static WifiInterface GetInterface()
        {
            WlanInterface result = null;
            var importance = 0;

            var client = new WlanClient();
            var interfaces = client.Interfaces;

            // Wi-Fiインタフェースが存在しないとき、nullを返す。
            if (interfaces.Length <= 0)
                return null;


            foreach (WlanInterface wlanIface in interfaces)
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
                var networks = wlanIface.GetAvailableNetworkList(0);
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

            return new WifiInterface(result);
        }


        private WlanInterface _wlanInterface;

        private WifiInterface(WlanInterface wlanInterface)
        {
            this._wlanInterface = wlanInterface;
        }

        public Profile GetCurrentProfile()
        {
            var currentProfileName = "";
            var currentProfileXml = "";

            try
            {
                var current = this._wlanInterface.CurrentConnection;
                currentProfileName = current.profileName;
            }
            catch (Exception)
            {
                // カレント接続が無いとき、nullを返す。
                return null;
            }

            foreach (Wlan.WlanProfileInfo profile in this._wlanInterface.GetProfiles())
            {
                try
                {
                    if (profile.profileName == currentProfileName)
                        currentProfileXml 
                            = this._wlanInterface
                                .GetProfileXml(profile.profileName);
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

        public async Task<bool> Connect(Profile profile)
        {
            this._wlanInterface.SetProfile(
                Wlan.WlanProfileFlags.AllUser, 
                profile.Xml, 
                true
            );

            var result = await Task.Run<bool>(() => 
            {
                return this._wlanInterface.ConnectSynchronously(
                    Wlan.WlanConnectionMode.Profile,
                    Wlan.Dot11BssType.Any,
                    profile.Name,
                    10000 // msec
                );
            });

            return result;
        }
    }
}
