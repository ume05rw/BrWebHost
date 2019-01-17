using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Initializer.Models.Langs
{
    public class Lang
    {
        private static Lang _instance = null;
        private static Xb.Type.Reflection _refs 
            = Xb.Type.Reflection.Get(typeof(Lang));

        public static Lang Instance => Lang._instance;


        public static void Init()
        {
            Lang._instance = new Lang();
            Lang.SetLang("ja.json");
        }

        public static void SetLang(string fileName)
        {
            // TODO: ./Models/Langs/{fileName}を取得
            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            var rootPath = Path.GetDirectoryName(pathToExe);
            var jsontPath = Path.Combine(rootPath, "Models\\Langs", fileName);
            var json = File.ReadAllText(jsontPath, Encoding.UTF8);
            var resource 
                = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);


            // TODO: Lang._instance のプロパティを取得し、名前が合致するものの値を上書き
            foreach (var kv in Lang._refs.Properties)
            {
                if (!resource.ContainsKey(kv.Key))
                    continue;

                // publicなセッターが無いので、アクセスできない。
                //kv.Value.Set(Lang.Instance, resource[kv.Key]);
                kv.Value.Info.SetValue(Lang.Instance, resource[kv.Key]);
                
            }
        }


        private Lang()
        {

        }

        public string AlreadyRunning { get; private set; }
        public string NowSetting { get; private set; }
        public string NowBooting { get; private set; }
        public string SettingFailed { get; private set; }
        public string DevicePreparation { get; private set; }
        public string PreparationStep1 { get; private set; }
        public string PreparationStep2 { get; private set; }
        public string PreparationStep3 { get; private set; }
        public string SettingSucceeded { get; private set; }
        public string SetYourWifi { get; private set; }
        public string Security { get; private set; }
        public string Ssid { get; private set; }
        public string Password { get; private set; }
        public string ShowPassword { get; private set; }
        public string Prev { get; private set; }
        public string Next { get; private set; }
        public string Retry { get; private set; }
        public string Exec { get; private set; }
        public string Close { get; private set; }
        public string WifiInterfacesNotFound { get; private set; }
        public string BroadlinkDeviceNotFound { get; private set; }
        public string PcWifiRestoringFailure { get; private set; }
        public string BroadlinkDeviceInitializeFailure { get; private set; }
        public string NewDeviceIpIs { get; private set; }
        public string NewDeviceIsReady { get; private set; }
    }
}
