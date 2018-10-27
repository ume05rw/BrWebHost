using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Entities
{
    /// <summary>
    /// シード登録済みテンプレート
    /// </summary>
    public enum Template
    {
        Tv = 1,
        Av = 2,
        Light = 3,
        AirCompressor = 4,
        A1Sensor = 5,
        Sp2Switch = 6,
        Sp1Switch = 7,
        SingleControl = 8,
        NoControl = 9,
    }

    /// <summary>
    /// 操作区分
    /// </summary>
    public enum ControlType
    {
        /// <summary>
        /// IR/RF信号操作
        /// </summary>
        RemoteControl = 1,

        /// <summary>
        /// Broadlinkデバイス操作
        /// </summary>
        BroadlinkDevice = 2,

        /// <summary>
        /// Wake On LAN 操作
        /// </summary>
        WakeOnLan = 3,

        /// <summary>
        /// フリースクリプト操作
        /// </summary>
        Script = 4,

        /// <summary>
        /// リモートBroadlinkWebホストのスクリプト
        /// </summary>
        RemoteHost = 5
    }
}
