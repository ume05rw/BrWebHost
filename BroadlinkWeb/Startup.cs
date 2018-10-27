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
#if DEBUG
                //options.UseMySQL(this.Configuration.GetConnectionString("DbConnectionMySql"));
                options.UseMySQL(this.Configuration.GetConnectionString("DbConnectionMySql3"));
#else
                options.UseMySQL(this.Configuration.GetConnectionString("DbConnectionMySql2"));
#endif

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
                    // どんだけクソ仕様なんだ。
                    options.SerializerSettings.ReferenceLoopHandling
                        = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
                });

            // DI対象にStoreを追加。
            services
                .AddDbStore<BrDeviceStore>()
                .AddDbStore<ControlSetStore>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
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


            // 起動時に、同期的に1回、LAN上のBroadlinkデバイスをスキャンする。
            using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var store = serviceScope.ServiceProvider.GetService<BrDeviceStore>();
                store.Refresh().GetAwaiter().GetResult();
            }

            // 恐らくこれは危険な実装な気がする。
            // 代替案はあるか？
            BrDeviceStore.Provider = app.ApplicationServices;
            BrDeviceStore.LoopScan = Task.Run(async () =>
            {
                // 5分に1回、LAN上のBroadlinkデバイスをスキャンする。
                while (true)
                {
                    try
                    {
                        using (var serviceScope = BrDeviceStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                        {
                            await Task.Delay(1000 * 60 * 5);

                            Xb.Util.Out("Regularly Broadlink Device Scan");
                            var store = serviceScope.ServiceProvider.GetService<BrDeviceStore>();
                            await store.Refresh();
                        }
                    }
                    catch (Exception ex)
                    {
                        Xb.Util.Out(ex);
                        Xb.Util.Out("FUUUUUUUUUUUUUUUUUUUUUUCK!!!");
                        Xb.Util.Out("Regularly Scan FAIL!!!!!!!!!!!!");
                        throw;
                    }
                }
            });
        }
    }
}
