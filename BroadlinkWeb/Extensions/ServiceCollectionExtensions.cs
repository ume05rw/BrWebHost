using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Dbc = BroadlinkWeb.Models.Dbc;

namespace BroadlinkWeb.Extensions
{
    /// <summary>
    /// サービス拡張
    /// </summary>
    /// <remarks>
    /// 注) Startup.csに名前空間"BroadlinkWeb.Extensions"を読ませておかないと、拡張が認識されない。
    /// </remarks>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Create Store
        /// </summary>
        /// <typeparam name="TStore"></typeparam>
        /// <param name="serviceCollection"></param>
        /// <returns></returns>
        public static IServiceCollection AddDbStore<TStore>(
            this IServiceCollection serviceCollection
        )
            where TStore : class
        {
            // ・追加メソッドの違い
            // http://ryuichi111std.hatenablog.com/entry/2016/07/17/102129
            //   「オブジェクトのライフタイム」を参照のこと
            // 対象インスタンスのライフタイムごとに、メソッドが異なる。

            // .AddTransient()
            // インジェクション1回ごとに、インスタンスが1つ生成される。
            // 取得1回ごとに異なるインスタンスが返ってくる。
            // serviceCollection.AddTransient()
            //
            // .AddScoped()
            // 1リクエストごとに、インスタンスが1つ生成される。
            // 1リクエスト中に複数回取得される場合は同じインスタンスが返ってくる。
            // serviceCollection.AddScoped()
            //
            // .AddSingleton()
            // インスタンスは1つだけ生成される。何度インジェクションしても同じインスタンスが返ってくる。
            // serviceCollection.AddSingleton()

            // ・二つの引数の意味合い
            // 1つ目は、要求されるインタフェース(クラスも可だが、DIの思想に則っていない点に注意)
            // 2つ目は、生成して返されるクラス／インタフェース
            serviceCollection.AddTransient<TStore, TStore>();

            return serviceCollection;
        }
    }
}
