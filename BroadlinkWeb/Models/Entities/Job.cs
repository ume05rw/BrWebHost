using MySql.Data.EntityFrameworkCore.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace BroadlinkWeb.Models.Entities
{
    [Table("jobs")] // テーブル名を小文字指定しないとLinuxで動作しない。
    [MySqlCharset("utf8")]
    [MySqlCollation("utf8_general_ci ")]
    public class Job
    {
        private static IServiceProvider Provider;
        public static void InitServiceProvider(IServiceProvider provider)
        {
            Job.Provider = provider;
        }


        [NotMapped]
        private IServiceProvider _provider => Job.Provider;

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="provider"></param>
        /// <remarks>
        /// Startup.csで、上述の InitServiceProvider() を実行しておくこと。
        /// Store, Controller等で取得できるIServiceProviderはスコープ済のものなので、
        /// すぐにDisposeされてしまう。
        /// 破棄されないIServiceProviderを保持するため、上記ロジックを差し込んである。
        /// 
        /// コンストラクタ引数にproviderをセット+DI登録しても、
        /// マイグレーション時にはDIコンテナを通さないため、落ちる。残念。
        /// </remarks>
        public Job()
        {
            this.IsCompleted = false;
            this.IsError = false;
            this.Progress = 0;
            this.Created = DateTime.Now;
            this.Updated = DateTime.Now;
        }

        [Key]
        [Column(Order = 0, TypeName = "int(11)")] // Orderプロパティは、EFCore未サポート
        [Description("Job ID")] // Description属性は、EFCore未サポート
        public int Id { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "varchar(50)")]
        [Description("Job Name")]
        public string Name { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "tinyint(1)")]
        [Description("Job complete flag")]
        public bool IsCompleted { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "tinyint(1)")]
        [Description("Error flag")]
        public bool IsError { get; set; }

        [Column(Order = 1, TypeName = "decimal(3, 2)")]
        [Description("Progress Percentage 0.0 - 1.0")]
        [Range(0, 1.0)]
        public decimal Progress { get; set; }

        [Column(Order = 1, TypeName = "varchar(255)")]
        [Description("Message")]
        [StringLength(255)]
        public string Message { get; set; }

        [Column(Order = 1, TypeName = "text")]
        [Description("Any Values JSON")]
        [StringLength(1000)]
        public string Json { get; set; }

        [Required]
        [Column(Order = 1, TypeName = "datetime")]
        [Description("Created Time")]
        [DataType(DataType.DateTime)]
        public DateTime Created { get; set; }

        [Column(Order = 1, TypeName = "datetime")]
        [Description("Updated Time")]
        [DataType(DataType.DateTime)]
        public DateTime? Updated { get; set; }


        public void SetJson(object value)
        {
            try
            {
                this.Json = JsonConvert.SerializeObject(value);
            }
            catch (Exception ex)
            {
                Xb.Util.Out(ex);
                throw;
            }
        }

        // 以下、実装に違和感がある。
        // EntityにDB更新機能を持たせるべきか否か？
        public async Task<bool> SetProgress(decimal progress, string json = null)
        {
            if (progress < 0)
                progress = 0;
            else if (1 < progress)
                progress = 1;

            this.Progress = progress;

            if (!string.IsNullOrEmpty(json))
                this.Json = json;

            if (1 <= this.Progress)
                this.IsCompleted = true;

            this.Updated = DateTime.Now;

            return await this.Save();
        }
        public async Task<bool> SetProgress(decimal progress, object jsonValues)
        {
            if (jsonValues == null)
                return await this.SetProgress(progress, null);
            else 
                return await this.SetProgress(progress, JsonConvert.SerializeObject(jsonValues));
        }

        public async Task<bool> SetFinish(bool isError = false, string json = null, string message = null)
        {
            this.IsCompleted = true;
            this.IsError = isError;

            if (!string.IsNullOrEmpty(message))
                this.Message = message;

            if (!string.IsNullOrEmpty(json))
                this.Json = json;

            this.Updated = DateTime.Now;

            return await this.Save();
        }
        public async Task<bool> SetFinish(bool isError = false, object jsonValues = null, string message = null)
        {
            if (jsonValues == null)
                return await this.SetFinish(isError, null, null);
            else
                return await this.SetFinish(isError, JsonConvert.SerializeObject(jsonValues), message);
        }

        private async Task<bool> Save()
        {
            using (var serviceScope = this._provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                try
                {
                    var dbc = serviceScope.ServiceProvider.GetService<Dbc>();

                    if (this.Id == default(int))
                        dbc.Jobs.Add(this); // 新規Entity
                    else
                        dbc.Entry(this).State = EntityState.Modified; // 既存Entity

                    await dbc.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Xb.Util.Out(ex);
                    return false;
                }
            }

            return true;
        }

    }
}
