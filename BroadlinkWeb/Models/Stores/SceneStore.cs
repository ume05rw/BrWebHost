using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BroadlinkWeb.Models.Stores
{
    public class SceneStore
    {
        private static IServiceProvider Provider;
        public static void SetServiceProvider(IServiceProvider provider)
        {
            SceneStore.Provider = provider;
        }
        public static void ReleaseServiceProvider()
        {
            SceneStore.Provider = null;
        }


        private Dbc _dbc;
        private JobStore _jobStore;

        public SceneStore(
            [FromServices] Dbc dbc,
            [FromServices] JobStore jobStore
        )
        {
            Xb.Util.Out("SceneStore.Constructor");
            this._dbc = dbc;
            this._jobStore = jobStore;
        }

        /// <summary>
        /// シーンを実行する。
        /// </summary>
        /// <param name="scene"></param>
        /// <returns></returns>
        /// <remarks>
        /// 順次実行処理を起動だけ行い、ジョブを生成して返す。
        /// </remarks>
        public async Task<Job> Exec(Scene scene)
        {
            var status = new SceneStatus();
            status.TotalStep = scene.Details.Count;
            var job = await this._jobStore.CreateJob("Scene Execution", status);

#pragma warning disable 4014
            this.InnerExec(job, scene, status)
                .ConfigureAwait(false);
#pragma warning restore 4014

            return job;
        }

        /// <summary>
        /// シーン順次実行処理
        /// </summary>
        /// <param name="job"></param>
        /// <param name="scene"></param>
        /// <param name="status"></param>
        /// <returns></returns>
        public async Task<bool> InnerExec(Job job, Scene scene, SceneStatus status)
        {
            using (var serviceScope = SceneStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                foreach (var detail in scene.Details)
                {
                    if (detail.ControlSet == null || detail.Control == null)
                    {
                        status.Error = $"Operation Not Found by Step: {status.Step}";
                        await job.SetFinish(true, status, status.Error);
                        return false;
                    }

                    var controlSetStore = serviceScope.ServiceProvider.GetService<ControlSetStore>();
                    var errors = await controlSetStore.Exec(detail.Control);

                    if (errors.Length > 0)
                    {
                        var errString = string.Join(", ", errors.Select(e => $"{e.Name}: {e.Message}").ToArray());
                        status.Error = $"Operation Failure by Step: {status.Step}, {errString}";
                        await job.SetFinish(true, status, status.Error);
                        return false;
                    }

                    await job.SetProgress(status.Step / status.TotalStep, status);

                    // Stepはループ中に常に加算しておく。想定外挙動を検知し易いように。
                    status.Step++;

                    if (detail.WaitSecond > 0)
                    {
                        await Task.Delay((int)(detail.WaitSecond * 1000))
                            .ConfigureAwait(false);
                    }
                }
            }

            // 正常終了時、Step値を辻褄合わせする。
            status.Step = status.TotalStep;
            await job.SetFinish(false, status);

            return true;
        }
    }
}
