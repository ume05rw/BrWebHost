using SharpBroadlink;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Initializer.Models
{
    public class Settings
    {
        public Broadlink.WifiSecurityMode Security { get; }
        public string Ssid { get; }
        public string Password { get; }

        public bool Exists
        {
            get
            {
                return !string.IsNullOrEmpty(this.Ssid);
            }
        }

        public Settings(Broadlink.WifiSecurityMode security, string ssid, string password)
        {
            this.Security = security;
            this.Ssid = ssid;
            this.Password = password;
        }

        public Settings()
        {
            this.Security
                = (Broadlink.WifiSecurityMode)Properties.Settings.Default.Security;
            this.Ssid = Properties.Settings.Default.Ssid;
            this.Password = Properties.Settings.Default.Password;
        }

        public void Save()
        {
            Properties.Settings.Default.Security = (int)this.Security;
            Properties.Settings.Default.Ssid = this.Ssid;
            Properties.Settings.Default.Password = this.Password;
            Properties.Settings.Default.Save();
        }
    }
}
