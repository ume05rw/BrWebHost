using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BroadlinkWeb.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using BroadlinkWeb.Extensions;
using BroadlinkWeb.Models.Stores;
using BroadlinkWeb.Models.Entities;

namespace BroadlinkWeb
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // 追加済みのサービスの中から、ILoggerFactoryのインスタンスを取得する。
            var logService = services
                .FirstOrDefault(s => s.ServiceType == typeof(ILoggerFactory));

            services.AddDbContext<Dbc>(options =>
            {
                // ILoggerFactoryが取得出来ていれば、追加しておく。
                // DBのクエリログが各種ロガーに通知されるようになる。
                if (logService != null
                    && logService.ImplementationInstance != null)
                {
                    var loggreFactory = (ILoggerFactory)logService.ImplementationInstance;
                    options.UseLoggerFactory(loggreFactory);
                }

                options.UseSqlite("Data Source=scriptagent.db");
            });

            services
                .AddMvc()
                .AddJsonOptions(options =>
                {
                    // JSON生成時、キャメル先頭を大文字で返す。
                    options.SerializerSettings.ContractResolver
                        = new DefaultContractResolver();
                    // 先頭を小文字で返す場合
                    //= new CamelCasePropertyNamesContractResolver();

                    // 無限ループ検出時の動作。
                    // シリアライズエラー時、デフォルトでは途中状態の文字列を返してしまう。
                    options.SerializerSettings.ReferenceLoopHandling
                        = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            // DI対象にStore/Entityを追加。
            services
                .AddDbStore<RemoteHostStore>()
                .AddDbStore<ScriptStore>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IApplicationLifetime applicationLifetime, IHostingEnvironment env)
        {
            try
            {
                // TODO: マイグレーション時にも以下が実行されてしまい、落ちる。
                // マイグレーションと通常起動の区別がつかないか？
                RemoteHostStore.SetReciever();
            }
            catch (Exception ex)
            {
                Xb.Util.Out("Startup Scan Failed!");
                Xb.Util.Out(ex);
                // マイグレーション時にも実行されてしまう。
                // とりあえず握りつぶす。
            }

            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                // エリアが存在する場合はそのルートをセットする。
                routes.MapRoute(
                    name: "areaDefault",
                    template: "{area:exists}/{controller=Home}/{action=Index}/{id?}");

                // ↓デフォルト生成コード
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
