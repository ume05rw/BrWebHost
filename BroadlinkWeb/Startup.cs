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
                options.UseMySQL(this.Configuration.GetConnectionString("DbConnectionMySql"));
#else
                options.UseMySQL(this.Configuration.GetConnectionString("DbConnectionMySql2"));
#endif

            });

            services.AddMvc();
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
        }
    }
}
