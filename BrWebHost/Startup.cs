using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BrWebHost.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Serialization;
using BrWebHost.Extensions;
using BrWebHost.Models.Stores;
using BrWebHost.Models.Entities;

namespace BrWebHost
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        private ILogger _logger { get; set; }

        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
        }
        

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // 追加済みのサービスの中から、ILoggerFactoryのインスタンスを取得する。
            ILoggerFactory loggerFactory = null;
            var logServiceDescripter = services
                .FirstOrDefault(s => s.ServiceType == typeof(ILoggerFactory));

            var hasLoggerFactory = (logServiceDescripter != null && logServiceDescripter.ImplementationInstance != null);
            if (logServiceDescripter != null && logServiceDescripter.ImplementationInstance != null)
                loggerFactory = (ILoggerFactory)logServiceDescripter.ImplementationInstance;

            services.AddDbContext<Dbc>(options =>
                {
                    // ILoggerFactoryが取得出来ていれば、追加しておく。
                    // DBのクエリログが各種ロガーに通知されるようになる。
                    if (loggerFactory != null)
                        options.UseLoggerFactory(loggerFactory);

                    var dbPath = System.IO.Path.Combine(Program.CurrentPath, "brwebhost.db");

                    // マイグレーション時は例外にしないように。
                    //if (!System.IO.File.Exists(dbPath))
                    //    throw new Exception("DB-File Not Found!!: " + dbPath);

                    options.UseSqlite($"Data Source=\"{dbPath}\"");

                    // MySQL接続のとき
                    //options.UseMySQL(this.Configuration.GetConnectionString("DbConnectionMySql"));
                },
                ServiceLifetime.Transient, // 呼び出し都度インスタンシエイトする。
                ServiceLifetime.Transient
            );

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
                .AddDbStore<BrDeviceStore>()
                .AddDbStore<ControlSetStore>()
                .AddDbStore<RemoteHostStore>()
                .AddDbStore<RemoteScriptStore>()
                .AddDbStore<JobStore>()
                .AddDbStore<SceneStore>()
                .AddDbStore<WolStore>()
                .AddDbStore<ScriptStore>()
                .AddDbStore<Sp2Store>()
                .AddDbStore<A1Store>()
                .AddDbStore<ScheduleStore>()
                .AddDbStore<ServerStatusStore>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IApplicationLifetime applicationLifetime, IHostingEnvironment env)
        {
            try
            {
                this._logger = app.ApplicationServices.GetService<ILogger<ServerStatusStore>>();

                // スコープされていないサービスプロバイダの参照を、各static実装にセットしておく。
                Job.SetServiceProvider(app.ApplicationServices);
                SceneStore.SetServiceProvider(app.ApplicationServices);
                ControlSetStore.SetServiceProvider(app.ApplicationServices);
                RemoteHostStore.SetServiceProvider(app.ApplicationServices);
                RemoteHostStore.SetReciever();
                ScheduleStore.SetServiceProvider(app.ApplicationServices);

                // TODO: マイグレーション時にも以下が実行されてしまい、落ちる。
                // マイグレーションと通常起動の区別がつかないか？
                // なんか違和感がある実装。
                // 代替案はあるか？
                Timer.CreateInstance(app.ApplicationServices);
            }
            catch (Exception ex)
            {
                Xb.Util.Out("Startup Scan Failed!");
                Xb.Util.Out(ex);
                // マイグレーション時にも実行されてしまう。
                // とりあえず握りつぶす。
            }


            // アプリケーション起動／終了をハンドルする。
            // https://stackoverflow.com/questions/41675577/where-can-i-log-an-asp-net-core-apps-start-stop-error-events
            applicationLifetime.ApplicationStopping.Register(this.OnShutdown);


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

        private void OnShutdown()
        {
            this._logger.Log(LogLevel.Debug, "Startup.OnShutdown");

            Timer.DisposeInstance();

            Job.ReleaseServiceProvider();
            SceneStore.ReleaseServiceProvider();
            ControlSetStore.ReleaseServiceProvider();
            RemoteHostStore.ReleaseServiceProvider();
            ScheduleStore.ReleaseServiceProvider();
        }
    }
}
