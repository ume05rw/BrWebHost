using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharpBroadlink;
using SharpBroadlink.Devices;

namespace BroadlinkWeb.Models.Stores
{
    public class JobStore
    {
        private Dbc _dbc;
        private IServiceProvider _provider;

        public JobStore(
            [FromServices] Dbc dbc,
            [FromServices] IServiceProvider provider
        )
        {
            Xb.Util.Out("JobStore.Constructor");
            this._dbc = dbc;
            this._provider = provider;
        }

        public async Task<Job> CreateJob(string name, string json = null)
        {
            var result = new Job();
            result.Name = name;
            if (json != null)
                result.Json = json;

            // DBに保存する。
            await result.SetProgress(0);

            return result;
        }

        public async Task<Job> CreateJob(string name, object jsonValues)
        {
            var result = new Job();
            result.Name = name;
            if (jsonValues != null)
                result.SetJson(jsonValues);

            // DBに保存する。
            await result.SetProgress(0);

            return result;
        }
    }
}
