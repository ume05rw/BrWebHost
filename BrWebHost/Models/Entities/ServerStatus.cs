using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace BrWebHost.Models.Entities
{
    [Table("serverstatuses")] // テーブル名を小文字指定しないとLinuxで動作しない。
    //[MySqlCharset("utf8")]
    //[MySqlCollation("utf8_general_ci ")]
    public class ServerStatus
    {
        [Key]
        //[Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        public int Id { get; set; }

        /// <summary>
        /// AvailableWorkerThreads
        /// 使用可能なワーカースレッド数
        /// </summary>
        public int AvailableWTs { get; set; }

        /// <summary>
        /// AvailableCompletionPortThreads
        /// 使用可能な非同期I/Oスレッド数
        /// #非同期I/Oスレッドって、何？
        /// </summary>
        public int AvailableCPTs { get; set; }

        /// <summary>
        /// MaxWorkerThreads
        /// プール上のワーカースレッド最大数
        /// </summary>
        public int MaxWTs { get; set; }

        /// <summary>
        /// MaxCompletionPortThreads
        /// プール上の非同期I/Oスレッド最大数
        /// </summary>
        public int MaxCPTs { get; set; }

        /// <summary>
        /// ActiveWorkerThreads
        /// 現在稼働中のワーカースレッド数
        /// </summary>
        public int ActiveWTs { get; set; }

        /// <summary>
        /// ActiveCompletionPortThreads
        /// 現在稼働中の非同期I/Oスレッド最大数
        /// </summary>
        public int ActiveCPTs { get; set; }


        /// <summary>
        /// 使用中のワーキングセット量
        /// </summary>
        public long WorkingSetSize { get; set; }

        /// <summary>
        /// 使用中の仮想メモリ量
        /// </summary>
        public long VirtualMemorySize { get; set; }

        /// <summary>
        /// 使用中のページングファイルサイズ
        /// </summary>
        public long PagedMemorySize { get; set; }

        /// <summary>
        /// 使用中のプライベートメモリ量
        /// </summary>
        public long PrivateMemorySize { get; set; }

        /// <summary>
        /// 使用中の...
        /// </summary>
        public long NonpagedSystemMemorySize { get; set; }

        /// <summary>
        /// 使用中の...
        /// </summary>
        public long PagedSystemMemorySize { get; set; }

        /// <summary>
        /// プロセスが開いているファイル数
        /// </summary>
        /// <remarks>
        /// Linuxのみ対応
        /// </remarks>
        public int OpenedFiledCount { get; set; }

        [Required]
        //[Column(Order = 10, TypeName = "datetime")]
        [DataType(DataType.DateTime)]
        public DateTime Recorded { get; set; }
    }
}

