using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Initializer.Models
{
    public class Profile
    {
        public string Name { get; }
        public string Xml { get; }
        public string Ssid { get; }

        public Profile(string name, string xml)
        {
            this.Name = name;
            this.Xml = xml;
            this.Ssid = "";

            try
            {
                var doc = new XmlDocument();
                doc.LoadXml(this.Xml);

                var root = doc.DocumentElement;
                // root.SelectNodes("SSIDConfig/SSID/name") が効かない。なせ？

                // 名前空間定義を追加する必要があるらしい。
                // https://stackoverflow.com/questions/12607895/cant-get-xmldocument-selectnodes-to-retrieve-any-of-my-nodes
                // var mgr = new XmlNamespaceManager(doc.NameTable);
                // mgr.AddNamespace("a", "http://www.microsoft.com/networking/WLAN/profile/v1");
                // var nodes = root.SelectNodes("//a:SSIDConfig/a:SSID/a:name", mgr);
                // こんな感じか？

                // profile/v1 のv1が常にv1なのか不明。一部v3の表記が見られる。
                // もうめんどいので、foreachをネストする。
                // ああかっこわるいかっこわるい。
                foreach (XmlNode child1 in root.ChildNodes)
                {
                    if (child1.Name == "SSIDConfig")
                    {
                        foreach (XmlNode child2 in child1.ChildNodes)
                        {
                            if (child2.Name == "SSID")
                            {
                                foreach (XmlNode child3 in child2.ChildNodes)
                                {
                                    if (child3.Name == "name")
                                    {
                                        this.Ssid = child3.InnerText;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            catch (Exception)
            {
                // 何もしない。
            }
        }
    }

    public class BroadlinkProfile: Profile
    {
        public BroadlinkProfile() 
            : base(
                "BroadlinkProv",
                $@"<?xml version=""1.0""?>
<WLANProfile xmlns=""http://www.microsoft.com/networking/WLAN/profile/v1"">
    <name>BroadlinkProv</name>
    <SSIDConfig>
        <SSID>
            <hex>42726F61646C696E6B50726F76</hex>
            <name>BroadlinkProv</name>
        </SSID>
    </SSIDConfig>
    <connectionType>ESS</connectionType>
    <connectionMode>manual</connectionMode>
    <MSM>
        <security>
            <authEncryption>
                <authentication>open</authentication>
                <encryption>none</encryption>
                <useOneX>false</useOneX>
            </authEncryption>
        </security>
    </MSM>
    <MacRandomization xmlns=""http://www.microsoft.com/networking/WLAN/profile/v3"">
        <enableRandomization>false</enableRandomization>
    </MacRandomization>
</WLANProfile>"
            )
        {
        }
    }
}
