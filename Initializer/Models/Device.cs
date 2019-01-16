using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpBroadlink;

namespace Initializer.Models
{
    public class Device: IDisposable
    {
        private static List<Device> _devices = new List<Device>();

        public static async Task<Device[]> Discover()
        {
            var newDevs = new List<Device>();

            await Task.Run(async () => 
            {
                for(var i = 0; i < 3; i++)
                {
                    var devs = (await SharpBroadlink.Broadlink.Discover(3))
                        .Select(d => new Device(d))
                        .ToArray();

                    foreach (var dev in devs)
                    {
                        var exists = false;
                        foreach (var existsDev in Device._devices)
                        {
                            if (existsDev.Equals(dev))
                            {
                                exists = true;
                                break;
                            }
                        }

                        if (exists)
                        {
                            dev.Dispose();
                        }
                        else
                        {
                            Device._devices.Add(dev);
                            newDevs.Add(dev);
                        }
                    }
                }
            });

            return newDevs.ToArray();
        }

        public static void DisposeAll()
        {
            foreach (var dev in Device._devices)
            {
                dev.Dispose();
            }
            Device._devices.Clear();
        }


        private SharpBroadlink.Devices.IDevice _device;

        public Device(SharpBroadlink.Devices.IDevice brDevice)
        {
            this._device = brDevice;
        }

        public bool Equals(Device device)
        {
            return this._device.Mac.SequenceEqual(device._device.Mac);
        }

        public string GetIpAddressString()
        {
            var addrBytes = this._device
                .Host
                .Address
                .GetAddressBytes()
                .Where(b => b != (byte)0)
                .ToArray();

            Array.Reverse(addrBytes);
            var addrString = string.Join(".", addrBytes.Select(b => ((int)b).ToString()));

            return addrString;
        }

        #region IDisposable Support
        private bool IsDisposed = false; // 重複する呼び出しを検出するには

        protected virtual void Dispose(bool disposing)
        {
            if (!this.IsDisposed)
            {
                if (disposing)
                {
                    if (this._device != null)
                    {
                        try
                        {
                            this._device.Dispose();
                            this._device = null;
                        }
                        catch (Exception)
                        {
                        }
                    }
                }

                this.IsDisposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}
