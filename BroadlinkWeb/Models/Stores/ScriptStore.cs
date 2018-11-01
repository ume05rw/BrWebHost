using BroadlinkWeb.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using SharpBroadlink;
using SharpBroadlink.Devices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
namespace BroadlinkWeb.Models.Stores
{
    public class ScriptStore
    {
        public async Task<(bool IsSucceeded, string Result)> Exec(string script)
        {
            var rows = script
                .Replace("\r\n", "\n")
                .Replace("\r", "\n")
                .Split('\n');

            // タイムアウトを設定し、1秒以上は結果を待たないことにした。
            //// 一行ずつ実行、結果取得はしない。
            //// UI付きプログラムの場合、プログラム終了まで応答を返さないため。
            //foreach (var row in rows)
            //    Xb.App.Process.GetConsoleResultAsync(row)
            //        .ConfigureAwait(false);

            var results = new List<string>();
            var isSucceeded = true;
            foreach (var row in rows)
            {
                results.Add(row);
                var res = await Xb.App.Process.GetConsoleResultAsync(row, null, 1);
                results.Add(res.Message);

                if (!res.Succeeded && res.Message != "No Response")
                {
                    isSucceeded = false;
                    break;
                }
            }

            var result = string.Join("\n", results.ToArray());

            return (isSucceeded, result);
        }
    }
}
