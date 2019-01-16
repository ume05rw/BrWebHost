using System;
using System.ComponentModel;
using System.Management;
using System.Collections;
using System.Globalization;

namespace Initializer.Models
{
    // 関数 ShouldSerialize<PropertyName> は、特定のプロパティをシリアル化する必要があるかどうかを調べるために VS プロパティ ブラウザで使用される関数です。これらの関数はすべての ValueType プロパティに追加されます ( NULL に設定できない型のプロパティ、Int32, BOOLなど)。これらの関数は Is<PropertyName>Null 関数を使用します。これらの関数はまた、プロパティの NULL 値を調べるプロパティのための TypeConverter 実装でも使用され、Visual studio でドラッグ アンド ドロップをする場合は、プロパティ ブラウザに空の値が表示されるようにします。
    // Functions Is<PropertyName>Null() は、プロパティが NULL かどうかを調べるために使用されます。
    // 関数 Reset<PropertyName> は Null 許容を使用できる読み込み/書き込みプロパティに追加されます。これらの関数は、プロパティを NULL に設定するためにプロパティ ブラウザの VS デザイナによって使用されます。
    // プロパティ用にクラスに追加されたすべてのプロパティは、Visual Studio デザイナ内での動作を定義するように、また使用する TypeConverter を定義するように設定されています。
    // 日付と時間の間隔変換機能 ToDateTime, ToDmtfDateTime, ToTimeSpan および ToDmtfTimeInterval は、DMTF 日付と時間間隔を System.DateTime / System.TimeSpan に相互間で変換するのにクラスに追加されました。
    // WMI クラス用に生成された事前バインディング クラスです。Win32_NetworkAdapter
    public class NetworkAdapter : System.ComponentModel.Component
    {
        
        // クラスが存在する場所にWMI 名前空間を保持するプライベート プロパティです。
        private static string CreatedWmiNamespace = "root\\CimV2";
        
        // このクラスを作成した WMI クラスの名前を保持するプライベート プロパティです。
        private static string CreatedClassName = "Win32_NetworkAdapter";
        
        // さまざまなメソッドで使用される ManagementScope を保持するプライベート メンバ変数です。
        private static System.Management.ManagementScope statMgmtScope = null;
        
        private ManagementSystemProperties PrivateSystemProperties;
        
        // 基になる LateBound WMI オブジェクトです。
        private System.Management.ManagementObject PrivateLateBoundObject;
        
        // クラスの '自動コミット' 動作を保存するメンバ変数です。
        private bool AutoCommitProp;
        
        // インスタンスを表す埋め込みプロパティを保持するプライベート変数です。
        private System.Management.ManagementBaseObject embeddedObj;
        
        // 現在使用されている WMI オブジェクトです。
        private System.Management.ManagementBaseObject curObj;
        
        // インスタンスが埋め込みオブジェクトかどうかを示すフラグです。
        private bool isEmbedded;
        
        // 下記は WMI オブジェクトを使用してクラスのインスタンスを初期化するコンストラクタのオーバーロードです。
        public NetworkAdapter() {
            this.InitializeObject(null, null, null);
        }
        
        public NetworkAdapter(string keyDeviceID) {
            this.InitializeObject(null, new System.Management.ManagementPath(NetworkAdapter.ConstructPath(keyDeviceID)), null);
        }
        
        public NetworkAdapter(System.Management.ManagementScope mgmtScope, string keyDeviceID) {
            this.InitializeObject(((System.Management.ManagementScope)(mgmtScope)), new System.Management.ManagementPath(NetworkAdapter.ConstructPath(keyDeviceID)), null);
        }
        
        public NetworkAdapter(System.Management.ManagementPath path, System.Management.ObjectGetOptions getOptions) {
            this.InitializeObject(null, path, getOptions);
        }
        
        public NetworkAdapter(System.Management.ManagementScope mgmtScope, System.Management.ManagementPath path) {
            this.InitializeObject(mgmtScope, path, null);
        }
        
        public NetworkAdapter(System.Management.ManagementPath path) {
            this.InitializeObject(null, path, null);
        }
        
        public NetworkAdapter(System.Management.ManagementScope mgmtScope, System.Management.ManagementPath path, System.Management.ObjectGetOptions getOptions) {
            this.InitializeObject(mgmtScope, path, getOptions);
        }
        
        public NetworkAdapter(System.Management.ManagementObject theObject) {
            Initialize();
            if ((CheckIfProperClass(theObject) == true)) {
                PrivateLateBoundObject = theObject;
                PrivateSystemProperties = new ManagementSystemProperties(PrivateLateBoundObject);
                curObj = PrivateLateBoundObject;
            }
            else {
                throw new System.ArgumentException("クラス名が一致しません。");
            }
        }
        
        public NetworkAdapter(System.Management.ManagementBaseObject theObject) {
            Initialize();
            if ((CheckIfProperClass(theObject) == true)) {
                embeddedObj = theObject;
                PrivateSystemProperties = new ManagementSystemProperties(theObject);
                curObj = embeddedObj;
                isEmbedded = true;
            }
            else {
                throw new System.ArgumentException("クラス名が一致しません。");
            }
        }
        
        // WMI クラスの名前空間を返すプロパティです。
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string OriginatingNamespace {
            get {
                return "root\\CimV2";
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string ManagementClassName {
            get {
                string strRet = CreatedClassName;
                if ((curObj != null)) {
                    if ((curObj.ClassPath != null)) {
                        strRet = ((string)(curObj["__CLASS"]));
                        if (((strRet == null) 
                                    || (strRet == string.Empty))) {
                            strRet = CreatedClassName;
                        }
                    }
                }
                return strRet;
            }
        }
        
        // WMI オブジェクトのシステム プロパティを取得するための埋め込みオブジェクトをポイントするプロパティです。
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public ManagementSystemProperties SystemProperties {
            get {
                return PrivateSystemProperties;
            }
        }
        
        // 基になる LateBound WMI オブジェクトを返すプロパティです。
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public System.Management.ManagementBaseObject LateBoundObject {
            get {
                return curObj;
            }
        }
        
        // オブジェクトの ManagementScope です。
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public System.Management.ManagementScope Scope {
            get {
                if ((isEmbedded == false)) {
                    return PrivateLateBoundObject.Scope;
                }
                else {
                    return null;
                }
            }
            set {
                if ((isEmbedded == false)) {
                    PrivateLateBoundObject.Scope = value;
                }
            }
        }
        
        // WMI オブジェクトのコミット動作を表示するプロパティです。 これが true の場合、プロパティが変更するたびに WMI オブジェクトは自動的に保存されます (すなわち、プロパティを変更した後で Put() が呼び出されます)。
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool AutoCommit {
            get {
                return AutoCommitProp;
            }
            set {
                AutoCommitProp = value;
            }
        }
        
        // 基になる WMI オブジェクトの ManagementPath です。
        [Browsable(true)]
        public System.Management.ManagementPath Path {
            get {
                if ((isEmbedded == false)) {
                    return PrivateLateBoundObject.Path;
                }
                else {
                    return null;
                }
            }
            set {
                if ((isEmbedded == false)) {
                    if ((CheckIfProperClass(null, value, null) != true)) {
                        throw new System.ArgumentException("クラス名が一致しません。");
                    }
                    PrivateLateBoundObject.Path = value;
                }
            }
        }
        
        // さまざまなメソッドで使用されるプライベート スタティック スコープ プロパティです。
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public static System.Management.ManagementScope StaticScope {
            get {
                return statMgmtScope;
            }
            set {
                statMgmtScope = value;
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("AdapterType プロパティは、使用中のネットワーク メディアを反映します。このプロパティは、このクラス内のネットワーク アダプターの種類すべてに適用されな" +
            "い場合があります。Windows NT のみです。")]
        public string AdapterType {
            get {
                return ((string)(curObj["AdapterType"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsAdapterTypeIdNull {
            get {
                if ((curObj["AdapterTypeId"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description(@"AdapterTypeId プロパティは、使用中のネットワーク メディアを反映します。このプロパティは、次の対応する整数値の形式で情報が返される以外は AdapterType プロパティと同じ情報を提供します: 
0 - イーサネット 802.3
1 - トークン リング 802.5
2 - ファイバー分散データ インタ-フェイス (FDDI)
3 - ワイド エリア ネットワーク (WAN)
4 - LocalTalk
5 - DIX ヘッダー形式のイーサネット
6 - ARCNET
7 - ARCNET (878.2)
8 - ATM
9 - ワイヤレス
10 - 赤外線ワイヤレス
11 - Bpc
12 - CoWan
13 - 1394
このプロパティは、このクラス内に一覧されているすべてのネットワーク アダプターの種類に適用できない可能性があります。Windows NT のみです。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public AdapterTypeIdValues AdapterTypeId {
            get {
                if ((curObj["AdapterTypeId"] == null)) {
                    return ((AdapterTypeIdValues)(System.Convert.ToInt32(14)));
                }
                return ((AdapterTypeIdValues)(System.Convert.ToInt32(curObj["AdapterTypeId"])));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsAutoSenseNull {
            get {
                if ((curObj["AutoSense"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("NetworkAdapter が接続されたネットワーク メディアの速度または他の通信特性を自動的に決定できるかどうかを示すプール値です。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public bool AutoSense {
            get {
                if ((curObj["AutoSense"] == null)) {
                    return System.Convert.ToBoolean(0);
                }
                return ((bool)(curObj["AutoSense"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsAvailabilityNull {
            get {
                if ((curObj["Availability"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description(@"デバイスの利用可能性と状態です。たとえば、Availability プロパティは、デバイスが実行中で通常の電力状態 (値 = 3) にあるか、警告 (4)、テスト中 (5)、低下 (10)、または省電力状態 (値 = 13-15 および 17) にあることを示します。省電力状態は次のように定義されています: 値 13 (""省電力 - 不明"") は、デバイスが省電力モードになっていることは確かだが、省電力モードにおけるどの状態にあるかが不明であることを示します。値 14 (""省電力 - 低電力モード"") は、デバイスが省電力状態になっているが機能しており、パフォーマンスは低下する場合があることを示します。値 15 (""省電力 - スタンバイ"") は、デバイスが機能していないが、通常の電力での動作に 'すばやく' 移行できることを示します。値 17 (""省電力 - 警告"") は、デバイスが警告状態になっているが、省電力モードでもあることを示します。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public AvailabilityValues Availability {
            get {
                if ((curObj["Availability"] == null)) {
                    return ((AvailabilityValues)(System.Convert.ToInt32(0)));
                }
                return ((AvailabilityValues)(System.Convert.ToInt32(curObj["Availability"])));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Caption {
            get {
                return ((string)(curObj["Caption"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsConfigManagerErrorCodeNull {
            get {
                if ((curObj["ConfigManagerErrorCode"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description(@"Win32 構成マネージャーのエラー コードを示します。次の値が返されます: 
0      このデバイスは正常に動作しています。
1      このデバイスは正しく構成されていません。
2      このデバイスのドライバーを読み込めません。
3      このデバイスのドライバーは壊れているか、あるいはメモリまたは他のリソースが不足している状態でシステムが実行されている可能性があります。
4      このデバイスは正常に動作していません。ドライバーつまたはレジストリが壊れている可能性があります。
5      このデバイスのドライバーには Windows が管理できないリソースが必要です。
6      このデバイスのブート構成が他のデバイスと競合しています。
7      フィルター処理できません。
8      デバイスのドライバー ローダーが見つかりません。
9      このデバイスを制御するファームウェアからリソースが正しく報告されないため、このデバイスは正常に動作していません。
10      このデバイスを開始できません。
11      このデバイスはエラーで停止しました。
12      このデバイスで使用できる十分な空きリソースが見つかりません。
13      このデバイスのリソースを確認できません。
14      コンピューターを再起動するまでこのデバイスは正常に動作しません。
15      このデバイスは、再列挙に問題が発生している可能性があり、正常に動作していません。
16      このデバイスで使用される一部のリソースを認識できません。
17      このデバイスは不明なリソースの種類を要求しています。
18      このデバイスのドライバーを再インストールしてください。
19      レジストリが壊れている可能性があります。
20      VxD ローダーの使用に失敗しました。
21      システム エラー: このデバイスのドライバーを変更してみてください。うまくいかない場合はハードウェアのマニュアルを参照してください。このデバイスは削除されます。
22      このデバイスは無効になっています。
23      システム障害: このデバイスのドライバーを変更してみてください。うまくいかない場合はハードウェアのマニュアルを参照してください。
24      このデバイスは存在しないか、正常に動作していないか、または一部のドライバーがインストールされていません。
25      このデバイスはまだセットアップ処理中です。
26      このデバイスはまだセットアップ処理中です。
27      このデバイスに有効なログ構成がありません。
28      このデバイスのドライバーはインストールされていません。
29      このデバイスは、必要なリソースがデバイスのファームウェアから提供されなかったため無効になっています。
30      このデバイスは、他のデバイスが使用している割り込み要求 (IRQ) リソースを使用しています。
31      このデバイスは、このデバイスに必要なドライバーを読み込めないため正常に動作していません。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public ConfigManagerErrorCodeValues ConfigManagerErrorCode {
            get {
                if ((curObj["ConfigManagerErrorCode"] == null)) {
                    return ((ConfigManagerErrorCodeValues)(System.Convert.ToInt32(32)));
                }
                return ((ConfigManagerErrorCodeValues)(System.Convert.ToInt32(curObj["ConfigManagerErrorCode"])));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsConfigManagerUserConfigNull {
            get {
                if ((curObj["ConfigManagerUserConfig"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("デバイスがユーザー定義の構成を使用しているかどうかを示します。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public bool ConfigManagerUserConfig {
            get {
                if ((curObj["ConfigManagerUserConfig"] == null)) {
                    return System.Convert.ToBoolean(0);
                }
                return ((bool)(curObj["ConfigManagerUserConfig"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("CreationClassName は、インスタンスの作成で使用されるクラス名、またはサブクラス名を示します。このクラスの他のキー プロパティと一緒に使用すると、" +
            "このクラスおよびそのサブクラスのインスタンスすべてがこのプロパティによって一意に識別されます。")]
        public string CreationClassName {
            get {
                return ((string)(curObj["CreationClassName"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Description {
            get {
                return ((string)(curObj["Description"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("DeviceID プロパティには、ネットワーク アダプターをシステム上のほかのデバイスと一意に識別する文字列が含まれています。")]
        public string DeviceID {
            get {
                return ((string)(curObj["DeviceID"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsErrorClearedNull {
            get {
                if ((curObj["ErrorCleared"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("ErrorCleared は LastErrorCode プロパティで報告されたエラーが現在解決されているかどうかを示すブール値のプロパティです。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public bool ErrorCleared {
            get {
                if ((curObj["ErrorCleared"] == null)) {
                    return System.Convert.ToBoolean(0);
                }
                return ((bool)(curObj["ErrorCleared"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("ErrorDescription は、LastErrorCode プロパティに記録されたエラーに関する詳細情報およびそれに対する修正アクションに関する情報を提供す" +
            "る自由形式の文字列です。")]
        public string ErrorDescription {
            get {
                return ((string)(curObj["ErrorDescription"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("GUID プロパティは、接続のグローバル一意識別子を指定します。")]
        public string GUID {
            get {
                return ((string)(curObj["GUID"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsIndexNull {
            get {
                if ((curObj["Index"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("Index プロパティは、システム レジストリに格納されているネットワーク アダプターのインデックス番号を示します。\n例: 0")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public uint Index {
            get {
                if ((curObj["Index"] == null)) {
                    return System.Convert.ToUInt32(0);
                }
                return ((uint)(curObj["Index"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsInstallDateNull {
            get {
                if ((curObj["InstallDate"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public System.DateTime InstallDate {
            get {
                if ((curObj["InstallDate"] != null)) {
                    return ToDateTime(((string)(curObj["InstallDate"])));
                }
                else {
                    return System.DateTime.MinValue;
                }
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsInstalledNull {
            get {
                if ((curObj["Installed"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("Installed プロパティにより、ネットワーク アダプターがシステムにインストールされているかどうかが決定されます。\n値: TRUE または FALSE. で" +
            "す。TRUE はネットワーク アダプターがインストールされていることを示します。\nInstalled プロパティは使用されていません。置き換える値はなく、このプ" +
            "ロパティは現在古い形式であると考えられます。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public bool Installed {
            get {
                if ((curObj["Installed"] == null)) {
                    return System.Convert.ToBoolean(0);
                }
                return ((bool)(curObj["Installed"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsInterfaceIndexNull {
            get {
                if ((curObj["InterfaceIndex"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("InterfaceIndex プロパティは、ローカル インターフェイスを一意に識別するインデックス値を含みます。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public uint InterfaceIndex {
            get {
                if ((curObj["InterfaceIndex"] == null)) {
                    return System.Convert.ToUInt32(0);
                }
                return ((uint)(curObj["InterfaceIndex"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsLastErrorCodeNull {
            get {
                if ((curObj["LastErrorCode"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("LastErrorCode には、その論理デバイスで最後に報告されたエラー コードが記録されています。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public uint LastErrorCode {
            get {
                if ((curObj["LastErrorCode"] == null)) {
                    return System.Convert.ToUInt32(0);
                }
                return ((uint)(curObj["LastErrorCode"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("MACAddress プロパティは、このネットワーク アダプターのメディア アクセス コントロール アドレスを示します。MAC アドレスは、製造元によってネットワ" +
            "ーク アダプターに割り当てられた一意な 48 ビットの番号です。このネットワーク アダプターが一意に識別され、マップされる TCP/IP ネットワーク通信に使用" +
            "されます。")]
        public string MACAddress {
            get {
                return ((string)(curObj["MACAddress"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("Manufacturer プロパティは、ネットワーク アダプターの製造元名を示します。\n例: 3COM")]
        public string Manufacturer {
            get {
                return ((string)(curObj["Manufacturer"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsMaxNumberControlledNull {
            get {
                if ((curObj["MaxNumberControlled"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("MaxNumberControlled プロパティは、このネットワーク アダプターでサポートされている直接アドレス可能なポートの最大数を示します。数値が不明な場合" +
            "は、値 0 が使用されます。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public uint MaxNumberControlled {
            get {
                if ((curObj["MaxNumberControlled"] == null)) {
                    return System.Convert.ToUInt32(0);
                }
                return ((uint)(curObj["MaxNumberControlled"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsMaxSpeedNull {
            get {
                if ((curObj["MaxSpeed"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("ネットワーク アダプターの最大速度 (ビット/秒) です。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public ulong MaxSpeed {
            get {
                if ((curObj["MaxSpeed"] == null)) {
                    return System.Convert.ToUInt64(0);
                }
                return ((ulong)(curObj["MaxSpeed"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Name {
            get {
                return ((string)(curObj["Name"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("NetConnectionID プロパティは、[ネットワーク接続] フォルダーにあるようにネットワーク接続名を指定します。")]
        public string NetConnectionID {
            get {
                return ((string)(curObj["NetConnectionID"]));
            }
            set {
                curObj["NetConnectionID"] = value;
                if (((isEmbedded == false) 
                            && (AutoCommitProp == true))) {
                    PrivateLateBoundObject.Put();
                }
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsNetConnectionStatusNull {
            get {
                if ((curObj["NetConnectionStatus"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description(@"NetConnectionStatus は、ネットワーク アダプターのネットワークへの接続状態を示す文字列です。プロパティの値は次のように解釈されます:
0 - 切断しています
1 -接続中です
2 - 接続しています
3 - 接続中です
4 - ハードウェアがありません
5 - ハードウェアは無効です
6 - ハードウェアが正常に機能していません
7 - メディアは切断しています
8 - 認証中です
9 - 認証に成功しました
10 - 認証に失敗しました
11 - アドレスが無効です
12 - 資格情報が必要です
.. - その他 - 上の一覧以外の整数値については、Win32 エラー コードのドキュメントを参照してください。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public ushort NetConnectionStatus {
            get {
                if ((curObj["NetConnectionStatus"] == null)) {
                    return System.Convert.ToUInt16(0);
                }
                return ((ushort)(curObj["NetConnectionStatus"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsNetEnabledNull {
            get {
                if ((curObj["NetEnabled"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("NetEnabled プロパティは、ネットワーク接続を有効化するかどうかを指定します。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public bool NetEnabled {
            get {
                if ((curObj["NetEnabled"] == null)) {
                    return System.Convert.ToBoolean(0);
                }
                return ((bool)(curObj["NetEnabled"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("アダプターのネットワーク アドレスを示す文字列の配列です。")]
        public string[] NetworkAddresses {
            get {
                return ((string[])(curObj["NetworkAddresses"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("PermanentAddress は、アダプターにハード コードされたネットワーク アドレスを定義します。この \'ハード コードされた\' アドレスはファームウェア" +
            "の更新またはソフトウェアの構成で変更されることがあります。その場合は、変更が生じたときにこのフィールドを更新する必要があります。ネットワーク アダプターに対して" +
            " \'ハード コードされた\' アドレスがない場合、PermanentAddress は空白にする必要があります。")]
        public string PermanentAddress {
            get {
                return ((string)(curObj["PermanentAddress"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsPhysicalAdapterNull {
            get {
                if ((curObj["PhysicalAdapter"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("PhysicalAdapter プロパティは、アダプターが物理アダプターか論理アダプターかを指定します。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public bool PhysicalAdapter {
            get {
                if ((curObj["PhysicalAdapter"] == null)) {
                    return System.Convert.ToBoolean(0);
                }
                return ((bool)(curObj["PhysicalAdapter"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("論理デバイスの Win32 プラグ アンド プレイ デバイス ID を示します。例: *PNP030b")]
        public string PNPDeviceID {
            get {
                return ((string)(curObj["PNPDeviceID"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description(@"論理デバイスの具体的な電源関連機能を示します。0=""不明""、1=""サポートされていません""、および 2=""無効"" は文字どおりの意味です。3=""有効"" は、電源管理機能は現在有効であるが、正確な機能セットが不明か、または情報を取得できないことを示します。""自動省電力モード"" (4) は、使用状況または他の条件に基づいてデバイスが電源の状態を変更できることを示します。""電源の状態設定可能"" (5) は、SetPowerState メソッドがサポートされていることを示します。""電源サイクル サポート"" (6) は、SetPowerState メソッドの PowerState 入力変数に 5 (""電源サイクル"") を設定して呼び出せることを示します。""時刻指定電源オン サポート"" (7) は、SetPowerState メソッドの PowerState 入力変数に 5 (""電源サイクル"") を設定し、Time パラメーターに電源オンの具体的な日時または時間間隔を設定して呼び出せることを示します。")]
        public PowerManagementCapabilitiesValues[] PowerManagementCapabilities {
            get {
                System.Array arrEnumVals = ((System.Array)(curObj["PowerManagementCapabilities"]));
                PowerManagementCapabilitiesValues[] enumToRet = new PowerManagementCapabilitiesValues[arrEnumVals.Length];
                int counter = 0;
                for (counter = 0; (counter < arrEnumVals.Length); counter = (counter + 1)) {
                    enumToRet[counter] = ((PowerManagementCapabilitiesValues)(System.Convert.ToInt32(arrEnumVals.GetValue(counter))));
                }
                return enumToRet;
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsPowerManagementSupportedNull {
            get {
                if ((curObj["PowerManagementSupported"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("デバイスの電源管理が可能である (省電力状態に移行できる) ことを示すブール値です。電源管理機能が現在有効であるかどうかや、有効である場合にどの機能がサポートされ" +
            "るかを示す値ではありません。そうした情報については PowerManagementCapabilities 配列を参照する必要があります。このブール値が fal" +
            "se の場合、PowerManagementCapabilities 配列には、文字列 \"サポートされていません\" を示す整数値 1 のエントリだけが含まれます" +
            "。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public bool PowerManagementSupported {
            get {
                if ((curObj["PowerManagementSupported"] == null)) {
                    return System.Convert.ToBoolean(0);
                }
                return ((bool)(curObj["PowerManagementSupported"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("ProductName プロパティは、ネットワーク アダプターの製品名を示します。\n例: Fast EtherLink XL")]
        public string ProductName {
            get {
                return ((string)(curObj["ProductName"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("ServiceName プロパティは、ネットワーク アダプターのサービス名を示します。この名前は通常、完全な製品名よりも短くなります。\n例: Elnkii")]
        public string ServiceName {
            get {
                return ((string)(curObj["ServiceName"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsSpeedNull {
            get {
                if ((curObj["Speed"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("現在の推定帯域幅 (1 秒あたりのビット数) です。帯域幅が変化する、または帯域幅の正確な推定が不可能なエンドポイントの場合、このプロパティには公称帯域幅が含まれ" +
            "ます。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public ulong Speed {
            get {
                if ((curObj["Speed"] == null)) {
                    return System.Convert.ToUInt64(0);
                }
                return ((ulong)(curObj["Speed"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public string Status {
            get {
                return ((string)(curObj["Status"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsStatusInfoNull {
            get {
                if ((curObj["StatusInfo"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("StatusInfo は、論理デバイスが有効 (値 = 3)、無効 (値 = 4)、その他の状態 (1) または不明な状態 (2) であることを示す文字列です。こ" +
            "のプロパティが論理デバイスに適用されない場合は、値 5 (\"該当なし\") が使用されます。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public StatusInfoValues StatusInfo {
            get {
                if ((curObj["StatusInfo"] == null)) {
                    return ((StatusInfoValues)(System.Convert.ToInt32(0)));
                }
                return ((StatusInfoValues)(System.Convert.ToInt32(curObj["StatusInfo"])));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("スコーピング システムの CreationClassName です。")]
        public string SystemCreationClassName {
            get {
                return ((string)(curObj["SystemCreationClassName"]));
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("スコーピング システムの名前です。")]
        public string SystemName {
            get {
                return ((string)(curObj["SystemName"]));
            }
        }
        
        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool IsTimeOfLastResetNull {
            get {
                if ((curObj["TimeOfLastReset"] == null)) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        
        [Browsable(true)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        [Description("TimeOfLastReset プロパティは、ネットワーク アダプターがいつ最後にリセットされたかを示します。")]
        [TypeConverter(typeof(WMIValueTypeConverter))]
        public System.DateTime TimeOfLastReset {
            get {
                if ((curObj["TimeOfLastReset"] != null)) {
                    return ToDateTime(((string)(curObj["TimeOfLastReset"])));
                }
                else {
                    return System.DateTime.MinValue;
                }
            }
        }
        
        private bool CheckIfProperClass(System.Management.ManagementScope mgmtScope, System.Management.ManagementPath path, System.Management.ObjectGetOptions OptionsParam) {
            if (((path != null) 
                        && (string.Compare(path.ClassName, this.ManagementClassName, true, System.Globalization.CultureInfo.InvariantCulture) == 0))) {
                return true;
            }
            else {
                return CheckIfProperClass(new System.Management.ManagementObject(mgmtScope, path, OptionsParam));
            }
        }
        
        private bool CheckIfProperClass(System.Management.ManagementBaseObject theObj) {
            if (((theObj != null) 
                        && (string.Compare(((string)(theObj["__CLASS"])), this.ManagementClassName, true, System.Globalization.CultureInfo.InvariantCulture) == 0))) {
                return true;
            }
            else {
                System.Array parentClasses = ((System.Array)(theObj["__DERIVATION"]));
                if ((parentClasses != null)) {
                    int count = 0;
                    for (count = 0; (count < parentClasses.Length); count = (count + 1)) {
                        if ((string.Compare(((string)(parentClasses.GetValue(count))), this.ManagementClassName, true, System.Globalization.CultureInfo.InvariantCulture) == 0)) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        
        private bool ShouldSerializeAdapterTypeId() {
            if ((this.IsAdapterTypeIdNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeAutoSense() {
            if ((this.IsAutoSenseNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeAvailability() {
            if ((this.IsAvailabilityNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeConfigManagerErrorCode() {
            if ((this.IsConfigManagerErrorCodeNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeConfigManagerUserConfig() {
            if ((this.IsConfigManagerUserConfigNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeErrorCleared() {
            if ((this.IsErrorClearedNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeIndex() {
            if ((this.IsIndexNull == false)) {
                return true;
            }
            return false;
        }
        
        // 指定された日付と時間を DMTF 形式から System.DateTime オブジェクトに変換します。
        static System.DateTime ToDateTime(string dmtfDate) {
            System.DateTime initializer = System.DateTime.MinValue;
            int year = initializer.Year;
            int month = initializer.Month;
            int day = initializer.Day;
            int hour = initializer.Hour;
            int minute = initializer.Minute;
            int second = initializer.Second;
            long ticks = 0;
            string dmtf = dmtfDate;
            System.DateTime datetime = System.DateTime.MinValue;
            string tempString = string.Empty;
            if ((dmtf == null)) {
                throw new System.ArgumentOutOfRangeException();
            }
            if ((dmtf.Length == 0)) {
                throw new System.ArgumentOutOfRangeException();
            }
            if ((dmtf.Length != 25)) {
                throw new System.ArgumentOutOfRangeException();
            }
            try {
                tempString = dmtf.Substring(0, 4);
                if (("****" != tempString)) {
                    year = int.Parse(tempString);
                }
                tempString = dmtf.Substring(4, 2);
                if (("**" != tempString)) {
                    month = int.Parse(tempString);
                }
                tempString = dmtf.Substring(6, 2);
                if (("**" != tempString)) {
                    day = int.Parse(tempString);
                }
                tempString = dmtf.Substring(8, 2);
                if (("**" != tempString)) {
                    hour = int.Parse(tempString);
                }
                tempString = dmtf.Substring(10, 2);
                if (("**" != tempString)) {
                    minute = int.Parse(tempString);
                }
                tempString = dmtf.Substring(12, 2);
                if (("**" != tempString)) {
                    second = int.Parse(tempString);
                }
                tempString = dmtf.Substring(15, 6);
                if (("******" != tempString)) {
                    ticks = (long.Parse(tempString) * ((long)((System.TimeSpan.TicksPerMillisecond / 1000))));
                }
                if (((((((((year < 0) 
                            || (month < 0)) 
                            || (day < 0)) 
                            || (hour < 0)) 
                            || (minute < 0)) 
                            || (minute < 0)) 
                            || (second < 0)) 
                            || (ticks < 0))) {
                    throw new System.ArgumentOutOfRangeException();
                }
            }
            catch (System.Exception e) {
                throw new System.ArgumentOutOfRangeException(null, e.Message);
            }
            datetime = new System.DateTime(year, month, day, hour, minute, second, 0);
            datetime = datetime.AddTicks(ticks);
            System.TimeSpan tickOffset = System.TimeZone.CurrentTimeZone.GetUtcOffset(datetime);
            int UTCOffset = 0;
            int OffsetToBeAdjusted = 0;
            long OffsetMins = ((long)((tickOffset.Ticks / System.TimeSpan.TicksPerMinute)));
            tempString = dmtf.Substring(22, 3);
            if ((tempString != "******")) {
                tempString = dmtf.Substring(21, 4);
                try {
                    UTCOffset = int.Parse(tempString);
                }
                catch (System.Exception e) {
                    throw new System.ArgumentOutOfRangeException(null, e.Message);
                }
                OffsetToBeAdjusted = ((int)((OffsetMins - UTCOffset)));
                datetime = datetime.AddMinutes(((double)(OffsetToBeAdjusted)));
            }
            return datetime;
        }
        
        // 指定された System.DateTime オブジェクトを DMTF 日付と時間の形式に変換します。
        static string ToDmtfDateTime(System.DateTime date) {
            string utcString = string.Empty;
            System.TimeSpan tickOffset = System.TimeZone.CurrentTimeZone.GetUtcOffset(date);
            long OffsetMins = ((long)((tickOffset.Ticks / System.TimeSpan.TicksPerMinute)));
            if ((System.Math.Abs(OffsetMins) > 999)) {
                date = date.ToUniversalTime();
                utcString = "+000";
            }
            else {
                if ((tickOffset.Ticks >= 0)) {
                    utcString = string.Concat("+", ((long)((tickOffset.Ticks / System.TimeSpan.TicksPerMinute))).ToString().PadLeft(3, '0'));
                }
                else {
                    string strTemp = ((long)(OffsetMins)).ToString();
                    utcString = string.Concat("-", strTemp.Substring(1, (strTemp.Length - 1)).PadLeft(3, '0'));
                }
            }
            string dmtfDateTime = ((int)(date.Year)).ToString().PadLeft(4, '0');
            dmtfDateTime = string.Concat(dmtfDateTime, ((int)(date.Month)).ToString().PadLeft(2, '0'));
            dmtfDateTime = string.Concat(dmtfDateTime, ((int)(date.Day)).ToString().PadLeft(2, '0'));
            dmtfDateTime = string.Concat(dmtfDateTime, ((int)(date.Hour)).ToString().PadLeft(2, '0'));
            dmtfDateTime = string.Concat(dmtfDateTime, ((int)(date.Minute)).ToString().PadLeft(2, '0'));
            dmtfDateTime = string.Concat(dmtfDateTime, ((int)(date.Second)).ToString().PadLeft(2, '0'));
            dmtfDateTime = string.Concat(dmtfDateTime, ".");
            System.DateTime dtTemp = new System.DateTime(date.Year, date.Month, date.Day, date.Hour, date.Minute, date.Second, 0);
            long microsec = ((long)((((date.Ticks - dtTemp.Ticks) 
                        * 1000) 
                        / System.TimeSpan.TicksPerMillisecond)));
            string strMicrosec = ((long)(microsec)).ToString();
            if ((strMicrosec.Length > 6)) {
                strMicrosec = strMicrosec.Substring(0, 6);
            }
            dmtfDateTime = string.Concat(dmtfDateTime, strMicrosec.PadLeft(6, '0'));
            dmtfDateTime = string.Concat(dmtfDateTime, utcString);
            return dmtfDateTime;
        }
        
        private bool ShouldSerializeInstallDate() {
            if ((this.IsInstallDateNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeInstalled() {
            if ((this.IsInstalledNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeInterfaceIndex() {
            if ((this.IsInterfaceIndexNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeLastErrorCode() {
            if ((this.IsLastErrorCodeNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeMaxNumberControlled() {
            if ((this.IsMaxNumberControlledNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeMaxSpeed() {
            if ((this.IsMaxSpeedNull == false)) {
                return true;
            }
            return false;
        }
        
        private void ResetNetConnectionID() {
            curObj["NetConnectionID"] = null;
            if (((isEmbedded == false) 
                        && (AutoCommitProp == true))) {
                PrivateLateBoundObject.Put();
            }
        }
        
        private bool ShouldSerializeNetConnectionStatus() {
            if ((this.IsNetConnectionStatusNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeNetEnabled() {
            if ((this.IsNetEnabledNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializePhysicalAdapter() {
            if ((this.IsPhysicalAdapterNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializePowerManagementSupported() {
            if ((this.IsPowerManagementSupportedNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeSpeed() {
            if ((this.IsSpeedNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeStatusInfo() {
            if ((this.IsStatusInfoNull == false)) {
                return true;
            }
            return false;
        }
        
        private bool ShouldSerializeTimeOfLastReset() {
            if ((this.IsTimeOfLastResetNull == false)) {
                return true;
            }
            return false;
        }
        
        [Browsable(true)]
        public void CommitObject() {
            if ((isEmbedded == false)) {
                PrivateLateBoundObject.Put();
            }
        }
        
        [Browsable(true)]
        public void CommitObject(System.Management.PutOptions putOptions) {
            if ((isEmbedded == false)) {
                PrivateLateBoundObject.Put(putOptions);
            }
        }
        
        private void Initialize() {
            AutoCommitProp = true;
            isEmbedded = false;
        }
        
        private static string ConstructPath(string keyDeviceID) {
            string strPath = "root\\CimV2:Win32_NetworkAdapter";
            strPath = string.Concat(strPath, string.Concat(".DeviceID=", string.Concat("\"", string.Concat(keyDeviceID, "\""))));
            return strPath;
        }
        
        private void InitializeObject(System.Management.ManagementScope mgmtScope, System.Management.ManagementPath path, System.Management.ObjectGetOptions getOptions) {
            Initialize();
            if ((path != null)) {
                if ((CheckIfProperClass(mgmtScope, path, getOptions) != true)) {
                    throw new System.ArgumentException("クラス名が一致しません。");
                }
            }
            PrivateLateBoundObject = new System.Management.ManagementObject(mgmtScope, path, getOptions);
            PrivateSystemProperties = new ManagementSystemProperties(PrivateLateBoundObject);
            curObj = PrivateLateBoundObject;
        }
        
        // WMI クラスのインスタンスを列挙する GetInstances() ヘルプのオーバーロードです。
        public static NetworkAdapterCollection GetInstances() {
            return GetInstances(null, null, null);
        }
        
        public static NetworkAdapterCollection GetInstances(string condition) {
            return GetInstances(null, condition, null);
        }
        
        public static NetworkAdapterCollection GetInstances(string[] selectedProperties) {
            return GetInstances(null, null, selectedProperties);
        }
        
        public static NetworkAdapterCollection GetInstances(string condition, string[] selectedProperties) {
            return GetInstances(null, condition, selectedProperties);
        }
        
        public static NetworkAdapterCollection GetInstances(System.Management.ManagementScope mgmtScope, System.Management.EnumerationOptions enumOptions) {
            if ((mgmtScope == null)) {
                if ((statMgmtScope == null)) {
                    mgmtScope = new System.Management.ManagementScope();
                    mgmtScope.Path.NamespacePath = "root\\CimV2";
                }
                else {
                    mgmtScope = statMgmtScope;
                }
            }
            System.Management.ManagementPath pathObj = new System.Management.ManagementPath();
            pathObj.ClassName = "Win32_NetworkAdapter";
            pathObj.NamespacePath = "root\\CimV2";
            System.Management.ManagementClass clsObject = new System.Management.ManagementClass(mgmtScope, pathObj, null);
            if ((enumOptions == null)) {
                enumOptions = new System.Management.EnumerationOptions();
                enumOptions.EnsureLocatable = true;
            }
            return new NetworkAdapterCollection(clsObject.GetInstances(enumOptions));
        }
        
        public static NetworkAdapterCollection GetInstances(System.Management.ManagementScope mgmtScope, string condition) {
            return GetInstances(mgmtScope, condition, null);
        }
        
        public static NetworkAdapterCollection GetInstances(System.Management.ManagementScope mgmtScope, string[] selectedProperties) {
            return GetInstances(mgmtScope, null, selectedProperties);
        }
        
        public static NetworkAdapterCollection GetInstances(System.Management.ManagementScope mgmtScope, string condition, string[] selectedProperties) {
            if ((mgmtScope == null)) {
                if ((statMgmtScope == null)) {
                    mgmtScope = new System.Management.ManagementScope();
                    mgmtScope.Path.NamespacePath = "root\\CimV2";
                }
                else {
                    mgmtScope = statMgmtScope;
                }
            }
            System.Management.ManagementObjectSearcher ObjectSearcher = new System.Management.ManagementObjectSearcher(mgmtScope, new SelectQuery("Win32_NetworkAdapter", condition, selectedProperties));
            System.Management.EnumerationOptions enumOptions = new System.Management.EnumerationOptions();
            enumOptions.EnsureLocatable = true;
            ObjectSearcher.Options = enumOptions;
            return new NetworkAdapterCollection(ObjectSearcher.Get());
        }
        
        [Browsable(true)]
        public static NetworkAdapter CreateInstance() {
            System.Management.ManagementScope mgmtScope = null;
            if ((statMgmtScope == null)) {
                mgmtScope = new System.Management.ManagementScope();
                mgmtScope.Path.NamespacePath = CreatedWmiNamespace;
            }
            else {
                mgmtScope = statMgmtScope;
            }
            System.Management.ManagementPath mgmtPath = new System.Management.ManagementPath(CreatedClassName);
            System.Management.ManagementClass tmpMgmtClass = new System.Management.ManagementClass(mgmtScope, mgmtPath, null);
            return new NetworkAdapter(tmpMgmtClass.CreateInstance());
        }
        
        [Browsable(true)]
        public void Delete() {
            PrivateLateBoundObject.Delete();
        }
        
        public uint Disable() {
            if ((isEmbedded == false)) {
                System.Management.ManagementBaseObject inParams = null;
                System.Management.ManagementBaseObject outParams = PrivateLateBoundObject.InvokeMethod("Disable", inParams, null);
                return System.Convert.ToUInt32(outParams.Properties["ReturnValue"].Value);
            }
            else {
                return System.Convert.ToUInt32(0);
            }
        }
        
        public uint Enable() {
            if ((isEmbedded == false)) {
                System.Management.ManagementBaseObject inParams = null;
                System.Management.ManagementBaseObject outParams = PrivateLateBoundObject.InvokeMethod("Enable", inParams, null);
                return System.Convert.ToUInt32(outParams.Properties["ReturnValue"].Value);
            }
            else {
                return System.Convert.ToUInt32(0);
            }
        }
        
        public uint Reset() {
            if ((isEmbedded == false)) {
                System.Management.ManagementBaseObject inParams = null;
                System.Management.ManagementBaseObject outParams = PrivateLateBoundObject.InvokeMethod("Reset", inParams, null);
                return System.Convert.ToUInt32(outParams.Properties["ReturnValue"].Value);
            }
            else {
                return System.Convert.ToUInt32(0);
            }
        }
        
        public uint SetPowerState(ushort PowerState, System.DateTime Time) {
            if ((isEmbedded == false)) {
                System.Management.ManagementBaseObject inParams = null;
                inParams = PrivateLateBoundObject.GetMethodParameters("SetPowerState");
                inParams["PowerState"] = ((ushort)(PowerState));
                inParams["Time"] = ToDmtfDateTime(((System.DateTime)(Time)));
                System.Management.ManagementBaseObject outParams = PrivateLateBoundObject.InvokeMethod("SetPowerState", inParams, null);
                return System.Convert.ToUInt32(outParams.Properties["ReturnValue"].Value);
            }
            else {
                return System.Convert.ToUInt32(0);
            }
        }
        
        public enum AdapterTypeIdValues {
            
            イーサネット_802_3 = 0,
            
            トークンリング_802_5 = 1,
            
            ファイバー分散データ_インタ_フェイス_FDDI_ = 2,
            
            ワイド_エリア_ネットワーク_WAN_ = 3,
            
            LocalTalk = 4,
            
            DIX_ヘッダー形式のイーサネット = 5,
            
            ARCNET = 6,
            
            ARCNET_878_2_ = 7,
            
            ATM = 8,
            
            ワイヤレス = 9,
            
            赤外線ワイヤレス = 10,
            
            Bpc = 11,
            
            CoWan = 12,
            
            Val_1394 = 13,
            
            NULL_ENUM_VALUE = 14,
        }
        
        public enum AvailabilityValues {
            
            その他 = 1,
            
            不明 = 2,
            
            実行中_通常の電力 = 3,
            
            警告 = 4,
            
            テスト中 = 5,
            
            該当なし = 6,
            
            電源オフ = 7,
            
            オフライン = 8,
            
            時間外 = 9,
            
            低下 = 10,
            
            インストールされていません = 11,
            
            インストール_エラー = 12,
            
            省電力_不明 = 13,
            
            省電力_低電力モード = 14,
            
            省電力_スタンバイ = 15,
            
            電源サイクル = 16,
            
            省電力_警告 = 17,
            
            一時停止 = 18,
            
            準備されていません = 19,
            
            構成されていません = 20,
            
            休止しています = 21,
            
            NULL_ENUM_VALUE = 0,
        }
        
        public enum ConfigManagerErrorCodeValues {
            
            このデバイスは正常に動作しています_ = 0,
            
            このデバイスは正しく構成されていません_ = 1,
            
            このデバイスのドライバーを読み込めません_ = 2,
            
            このデバイスのドライバーは壊れているか_あるいはメモリまたは他のリソースが不足している状態でシステムが実行されている可能性があります_ = 3,
            
            このデバイスは正常に動作していません_デバイスのドライバーまたはレジストリが壊れている可能性があります_ = 4,
            
            このデバイスのドライバーには_Windows_が管理できないリソースが必要です_ = 5,
            
            このデバイスのブート構成が他のデバイスと競合しています_ = 6,
            
            フィルター処理できません_ = 7,
            
            デバイスのドライバー_ローダーが見つかりません_ = 8,
            
            このデバイスを制御するファームウェアからリソースが正しく報告されないため_このデバイスは正常に動作していません_ = 9,
            
            このデバイスを開始できません_ = 10,
            
            このデバイスはエラーで停止しました_ = 11,
            
            このデバイスで使用できる十分な空きリソースが見つかりません_ = 12,
            
            このデバイスのリソースを確認できません_ = 13,
            
            コンピューターを再起動するまでこのデバイスは正常に動作しません_ = 14,
            
            このデバイスは_再列挙に問題が発生している可能性があり_正常に動作していません_ = 15,
            
            このデバイスで使用される一部のリソースを認識できません_ = 16,
            
            このデバイスは不明なリソースの種類を要求しています_ = 17,
            
            このデバイスのドライバーを再インストールしてください_ = 18,
            
            VxD_ローダーの使用に失敗しました_ = 19,
            
            レジストリが壊れている可能性があります_ = 20,
            
            システム_エラー_このデバイスのドライバーを変更してみてください_うまくいかない場合はハードウェアのマニュアルを参照してください_このデバイスは削除されます_ = 21,
            
            このデバイスは無効になっています_ = 22,
            
            システム_エラー_このデバイスのドライバーを変更してみてください_うまくいかない場合はハードウェアのマニュアルを参照してください_ = 23,
            
            このデバイスは存在しないか_正常に動作していないか_または一部のドライバーがインストールされていません_ = 24,
            
            このデバイスはまだセットアップ処理中です_ = 25,
            
            このデバイスはまだセットアップ処理中です_0 = 26,
            
            このデバイスに有効なログ構成がありません_ = 27,
            
            このデバイスのドライバーはインストールされていません_ = 28,
            
            このデバイスは_必要なリソースがデバイスのファームウェアから提供されなかったため無効になっています_ = 29,
            
            このデバイスは_他のデバイスが使用している割り込み要求_IRQ_リソースを使用しています_ = 30,
            
            このデバイスは_このデバイスに必要なドライバーを読み込めないため正常に動作していません_ = 31,
            
            NULL_ENUM_VALUE = 32,
        }
        
        public enum PowerManagementCapabilitiesValues {
            
            不明 = 0,
            
            サポートされていません = 1,
            
            無効 = 2,
            
            有効 = 3,
            
            自動省電力モード = 4,
            
            電源の状態設定可能 = 5,
            
            電源サイクル_サポート = 6,
            
            時刻指定電源オン_サポート = 7,
            
            NULL_ENUM_VALUE = 8,
        }
        
        public enum StatusInfoValues {
            
            その他 = 1,
            
            不明 = 2,
            
            有効 = 3,
            
            無効 = 4,
            
            該当なし = 5,
            
            NULL_ENUM_VALUE = 0,
        }
        
        // クラスのインスタンスを列挙する列挙子の実装です。
        public class NetworkAdapterCollection : object, ICollection {
            
            private ManagementObjectCollection privColObj;
            
            public NetworkAdapterCollection(ManagementObjectCollection objCollection) {
                privColObj = objCollection;
            }
            
            public virtual int Count {
                get {
                    return privColObj.Count;
                }
            }
            
            public virtual bool IsSynchronized {
                get {
                    return privColObj.IsSynchronized;
                }
            }
            
            public virtual object SyncRoot {
                get {
                    return this;
                }
            }
            
            public virtual void CopyTo(System.Array array, int index) {
                privColObj.CopyTo(array, index);
                int nCtr;
                for (nCtr = 0; (nCtr < array.Length); nCtr = (nCtr + 1)) {
                    array.SetValue(new NetworkAdapter(((System.Management.ManagementObject)(array.GetValue(nCtr)))), nCtr);
                }
            }
            
            public virtual System.Collections.IEnumerator GetEnumerator() {
                return new NetworkAdapterEnumerator(privColObj.GetEnumerator());
            }
            
            public class NetworkAdapterEnumerator : object, System.Collections.IEnumerator {
                
                private ManagementObjectCollection.ManagementObjectEnumerator privObjEnum;
                
                public NetworkAdapterEnumerator(ManagementObjectCollection.ManagementObjectEnumerator objEnum) {
                    privObjEnum = objEnum;
                }
                
                public virtual object Current {
                    get {
                        return new NetworkAdapter(((System.Management.ManagementObject)(privObjEnum.Current)));
                    }
                }
                
                public virtual bool MoveNext() {
                    return privObjEnum.MoveNext();
                }
                
                public virtual void Reset() {
                    privObjEnum.Reset();
                }
            }
        }
        
        // ValueType プロパティの NULL 値を扱う TypeConverter です。
        public class WMIValueTypeConverter : TypeConverter {
            
            private TypeConverter baseConverter;
            
            private System.Type baseType;
            
            public WMIValueTypeConverter(System.Type inBaseType) {
                baseConverter = TypeDescriptor.GetConverter(inBaseType);
                baseType = inBaseType;
            }
            
            public override bool CanConvertFrom(System.ComponentModel.ITypeDescriptorContext context, System.Type srcType) {
                return baseConverter.CanConvertFrom(context, srcType);
            }
            
            public override bool CanConvertTo(System.ComponentModel.ITypeDescriptorContext context, System.Type destinationType) {
                return baseConverter.CanConvertTo(context, destinationType);
            }
            
            public override object ConvertFrom(System.ComponentModel.ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value) {
                return baseConverter.ConvertFrom(context, culture, value);
            }
            
            public override object CreateInstance(System.ComponentModel.ITypeDescriptorContext context, System.Collections.IDictionary dictionary) {
                return baseConverter.CreateInstance(context, dictionary);
            }
            
            public override bool GetCreateInstanceSupported(System.ComponentModel.ITypeDescriptorContext context) {
                return baseConverter.GetCreateInstanceSupported(context);
            }
            
            public override PropertyDescriptorCollection GetProperties(System.ComponentModel.ITypeDescriptorContext context, object value, System.Attribute[] attributeVar) {
                return baseConverter.GetProperties(context, value, attributeVar);
            }
            
            public override bool GetPropertiesSupported(System.ComponentModel.ITypeDescriptorContext context) {
                return baseConverter.GetPropertiesSupported(context);
            }
            
            public override System.ComponentModel.TypeConverter.StandardValuesCollection GetStandardValues(System.ComponentModel.ITypeDescriptorContext context) {
                return baseConverter.GetStandardValues(context);
            }
            
            public override bool GetStandardValuesExclusive(System.ComponentModel.ITypeDescriptorContext context) {
                return baseConverter.GetStandardValuesExclusive(context);
            }
            
            public override bool GetStandardValuesSupported(System.ComponentModel.ITypeDescriptorContext context) {
                return baseConverter.GetStandardValuesSupported(context);
            }
            
            public override object ConvertTo(System.ComponentModel.ITypeDescriptorContext context, System.Globalization.CultureInfo culture, object value, System.Type destinationType) {
                if ((baseType.BaseType == typeof(System.Enum))) {
                    if ((value.GetType() == destinationType)) {
                        return value;
                    }
                    if ((((value == null) 
                                && (context != null)) 
                                && (context.PropertyDescriptor.ShouldSerializeValue(context.Instance) == false))) {
                        return  "NULL_ENUM_VALUE" ;
                    }
                    return baseConverter.ConvertTo(context, culture, value, destinationType);
                }
                if (((baseType == typeof(bool)) 
                            && (baseType.BaseType == typeof(System.ValueType)))) {
                    if ((((value == null) 
                                && (context != null)) 
                                && (context.PropertyDescriptor.ShouldSerializeValue(context.Instance) == false))) {
                        return "";
                    }
                    return baseConverter.ConvertTo(context, culture, value, destinationType);
                }
                if (((context != null) 
                            && (context.PropertyDescriptor.ShouldSerializeValue(context.Instance) == false))) {
                    return "";
                }
                return baseConverter.ConvertTo(context, culture, value, destinationType);
            }
        }
        
        // WMI システム プロパティを表す埋め込みクラスです。
        [TypeConverter(typeof(System.ComponentModel.ExpandableObjectConverter))]
        public class ManagementSystemProperties {
            
            private System.Management.ManagementBaseObject PrivateLateBoundObject;
            
            public ManagementSystemProperties(System.Management.ManagementBaseObject ManagedObject) {
                PrivateLateBoundObject = ManagedObject;
            }
            
            [Browsable(true)]
            public int GENUS {
                get {
                    return ((int)(PrivateLateBoundObject["__GENUS"]));
                }
            }
            
            [Browsable(true)]
            public string CLASS {
                get {
                    return ((string)(PrivateLateBoundObject["__CLASS"]));
                }
            }
            
            [Browsable(true)]
            public string SUPERCLASS {
                get {
                    return ((string)(PrivateLateBoundObject["__SUPERCLASS"]));
                }
            }
            
            [Browsable(true)]
            public string DYNASTY {
                get {
                    return ((string)(PrivateLateBoundObject["__DYNASTY"]));
                }
            }
            
            [Browsable(true)]
            public string RELPATH {
                get {
                    return ((string)(PrivateLateBoundObject["__RELPATH"]));
                }
            }
            
            [Browsable(true)]
            public int PROPERTY_COUNT {
                get {
                    return ((int)(PrivateLateBoundObject["__PROPERTY_COUNT"]));
                }
            }
            
            [Browsable(true)]
            public string[] DERIVATION {
                get {
                    return ((string[])(PrivateLateBoundObject["__DERIVATION"]));
                }
            }
            
            [Browsable(true)]
            public string SERVER {
                get {
                    return ((string)(PrivateLateBoundObject["__SERVER"]));
                }
            }
            
            [Browsable(true)]
            public string NAMESPACE {
                get {
                    return ((string)(PrivateLateBoundObject["__NAMESPACE"]));
                }
            }
            
            [Browsable(true)]
            public string PATH {
                get {
                    return ((string)(PrivateLateBoundObject["__PATH"]));
                }
            }
        }
    }
}
