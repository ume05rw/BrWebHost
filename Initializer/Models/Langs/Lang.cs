using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Initializer.Models.Langs
{
    public class Lang
    {
        private const string DefaultLanguageFile = "en.json";
        private const string EnglishLanguageFile = "en.json";
        private const string JapaneseLanguageFile = "ja.json";
        private const string ChineseLanguageFile = "zh-cn.json";

        #region "static"

        private static Lang _instance = null;
        private static Xb.Type.Reflection _refs = null;

        public static Lang Instance
        {
            get
            {
                if (Lang._instance == null)
                    Lang.Init();

                return Lang._instance;
            }
        }

        private static void Init()
        {
            Lang._instance = new Lang();
            Lang.SetLang(Lang.DefaultLanguageFile);
            Lang.SetLang(Lang.GetCurrentLanguageFileName());

            //Lang.SetLang(Lang.ChineseLanguageFile);
        }

        public static void SetLang(string fileName)
        {
            if (Lang._refs == null)
                Lang._refs = Xb.Type.Reflection.Get(typeof(Lang));

            // ./Models/Langs/{fileName} から言語Key-Valueセットを取得。
            var resource = Lang.GetLangResource(fileName);

            // Langクラスのプロパティを取得し、名前が合致するものの値を上書き
            foreach (var kv in Lang._refs.Properties)
            {
                if (!resource.ContainsKey(kv.Key) 
                    || string.IsNullOrEmpty(resource[kv.Key]))
                    continue;

                // publicなセッターが無いので、アクセスできない。
                // PropertyInfo.SetValueでセットする。
                //kv.Value.Set(Lang.Instance, resource[kv.Key]);
                kv.Value.Info.SetValue(Lang.Instance, resource[kv.Key]);
            }
        }

        private static Dictionary<string, string> GetLangResource(string fileName)
        {
            var result = default(Dictionary<string, string>);

            var pathToExe = Process.GetCurrentProcess().MainModule.FileName;
            var rootPath = Path.GetDirectoryName(pathToExe);

            if (string.IsNullOrEmpty(fileName))
                fileName = Lang.DefaultLanguageFile;

            var jsonPath = Path.Combine(rootPath, "Models\\Langs", fileName);

            if (!File.Exists(jsonPath))
                jsonPath = Path.Combine(rootPath, $"Models\\Langs\\{Lang.DefaultLanguageFile}");

            var json = "";
            try
            {
                json = File.ReadAllText(jsonPath, Encoding.UTF8);
            }
            catch (Exception)
            {
                MessageBox.Show(
                    "Language file NOT found. Please re-install Initializer", 
                    "Broadlink Device Initializer", 
                    MessageBoxButtons.OK, 
                    MessageBoxIcon.Exclamation
                );
                Application.Exit();
            }

            try
            {
                result = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
            }
            catch (Exception)
            {
                if (fileName == "en.json")
                {
                    MessageBox.Show(
                        "Default language file Broken. \r\nPlease re-install Initializer",
                        "Broadlink Device Initializer",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Exclamation
                    );
                    Application.Exit();
                }
                else
                {
                    MessageBox.Show(
                        $"Language file [{fileName}] is Broken. \r\nSet to default language.",
                        "Broadlink Device Initializer",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Exclamation
                    );

                    result = Lang.GetLangResource(Lang.DefaultLanguageFile);
                }
            }

            if (result == null)
            {
                MessageBox.Show(
                    "Default language file Broken. \r\nPlease re-install Initializer",
                    "Broadlink Device Initializer",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Exclamation
                );
                Application.Exit();
            }

            return result;
        }

        private static string GetCurrentLanguageFileName()
        {
            var cultureName = System.Globalization.CultureInfo.CurrentCulture.Name.ToLower();

            //MessageBox.Show($"System Lang is {cultureName}");

            if (cultureName.IndexOf("ja-") >= 0)
                return Lang.JapaneseLanguageFile;
            else if (cultureName.IndexOf("zh-cn") >= 0
                     || cultureName.IndexOf("zh-sg") >= 0)
                return Lang.ChineseLanguageFile;
            else if (cultureName.IndexOf("en-") >= 0)
                return Lang.EnglishLanguageFile;

            return Lang.DefaultLanguageFile;
        }

        #endregion


        /// <summary>
        /// 
        /// </summary>
        /// <remarks>
        /// シングルトンにする。
        /// </remarks>
        private Lang()
        {
        }

        public string FontName { get; private set; }

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
