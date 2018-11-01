using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
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
        public static void InitServiceProvider(IServiceProvider provider)
        {
            SceneStore.Provider = provider;
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

        public async Task<Job> Exec(Scene scene)
        {
            var status = new SceneStatus();
            status.TotalStep = scene.Details.Count;
            var job = await this._jobStore.CreateJob("Scene Execution", status);

            this.InnerExec(job, scene, status)
                .ConfigureAwait(false);

            return job;
        }

        public async Task<bool> InnerExec(Job job, Scene scene, SceneStatus status)
        {
            foreach (var detail in scene.Details)
            {
                if (detail.ControlSet == null || detail.Control == null)
                {
                    status.Error = $"Operation Not Found by Step: {status.Step}";
                    await job.SetFinish(true, status, status.Error);
                    return false;
                }

                var error = "";
                try
                {
                    switch (detail.ControlSet.OperationType)
                    {
                        case OperationType.RemoteControl:
                            var brd1 = await this.GetBrDevice(detail.ControlSet.BrDeviceId);
                            if (brd1 == null)
                            {
                                error = "Not Found Broadlink Device.";
                                break;
                            }

                            var rm = (Rm)brd1.SbDevice;
                            var pBytes = Signals.String2ProntoBytes(detail.Control.Code);
                            var result = await rm.SendPronto(pBytes);

                            if (result == false)
                            {
                                error = "Command Exec Failure.";
                                break;
                            }

                            break;
                        case OperationType.BroadlinkDevice:
                            var brd2 = await this.GetBrDevice(detail.ControlSet.BrDeviceId);
                            if (brd2 == null)
                            {
                                error = "Not Found Broadlink Device.";
                                break;
                            }



                            break;
                        case OperationType.WakeOnLan:
                            try
                            {
                                using (var serviceScope = SceneStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                                {
                                    var wolStore = serviceScope.ServiceProvider.GetService<WolStore>();
                                    var res = await wolStore.Exec(detail.Control.Code);
                                    if (res == false)
                                    {
                                        error = "Wake on LAN Failure.";
                                        break;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                error = ex.Message;
                                break;
                            }

                            break;
                        case OperationType.Script:
                            try
                            {
                                using (var serviceScope = SceneStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                                {
                                    var scriptStore = serviceScope.ServiceProvider.GetService<ScriptStore>();
                                    var res = await scriptStore.Exec(detail.Control.Code);
                                    if (!res.IsSucceeded)
                                    {
                                        error = res.Result;
                                        break;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                error = ex.Message;
                                break;
                            }

                            break;
                        case OperationType.RemoteHost:
                            try
                            {
                                using (var serviceScope = SceneStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
                                {
                                    var rhStore = serviceScope.ServiceProvider.GetService<RemoteHostStore>();
                                    var res = await rhStore.Exec(null);
                                    if (!res.IsSucceeded)
                                    {
                                        error = res.Result;
                                        break;
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                error = ex.Message;
                                break;
                            }
                            break;
                        case OperationType.Scene:
                        default:
                            // ここにはこないはず。
                            throw new Exception("なんでー！？");
                    }
                }
                catch (Exception ex)
                {
                    error = "Unexpected Error: " + string.Join(" ", Xb.Util.GetErrorString(ex));
                }


                if (!string.IsNullOrEmpty(error))
                {
                    status.Error = $"Operation Failure by Step: {status.Step}, {error}";
                    await job.SetFinish(true, status, status.Error);
                    return false;
                }

                await job.SetProgress(status.Step / status.TotalStep, status);
                status.Step++;

                if (detail.WaitSecond > 0)
                {
                    await Task.Delay((int)(detail.WaitSecond * 1000))
                        .ConfigureAwait(false);
                }
            }

            await job.SetFinish(false, status);

            return true;
        }

        private async Task<BrDevice> GetBrDevice(int? id)
        {
            using (var serviceScope = SceneStore.Provider.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var brStore = serviceScope.ServiceProvider.GetService<BrDeviceStore>();
                return await brStore.Get((int)id);
            }
        }
    }
}
