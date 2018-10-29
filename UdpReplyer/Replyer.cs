using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace UdpReplyer
{
    public class Replyer: IDisposable
    {
        private const string CallString = "hello?";
        private const string ResponseString = "here!";

        private Xb.Net.Udp Socket;
        private List<byte[]> _localAddresses;



        public Replyer(int port)
        {
            this._localAddresses = new List<byte[]>();
            var locals = Xb.Net.Util.GetLocalAddresses();
            foreach (var addr in locals)
                this._localAddresses.Add(addr.GetAddressBytes());

            this.Socket = new Xb.Net.Udp(port);
            this.Socket.OnRecieved += this.OnRecieved;
        }

        private void OnRecieved(object sender, Xb.Net.RemoteData rdata)
        {
            // 受信文字列が仕様外のとき、なにもしない。
            var call = Encoding.UTF8.GetString(rdata.Bytes);
            if (call != Replyer.CallString)
                return;

            var addr = rdata.RemoteEndPoint.Address.GetAddressBytes();

            // IPv4射影アドレスのとき、v4アドレスに変換。
            if (
                // 長さが16バイト
                addr.Length == 16
                // 先頭10バイトが全て0
                && addr.Take(10).All(b => b == 0)
                // 11, 12バイトが FF
                && addr.Skip(10).Take(2).All(b => b == 255)
            )
            {
                addr = addr.Skip(12).Take(4).ToArray();
            }

            // ローカルアドレスからの呼びかけのとき、なにもしない。
            if (this._localAddresses.Any(b => b.SequenceEqual(addr)))
                return;

            // 応答を返す。
            var resStr = Replyer.ResponseString + System.Environment.MachineName;
            var response = Encoding.UTF8.GetBytes(resStr);
            this.Socket.SendTo(response, rdata.RemoteEndPoint);
            //Xb.Net.Udp.SendOnce(response, rdata.RemoteEndPoint);
        }


        #region IDisposable Support
        private bool _isDisposed = false;

        protected virtual void Dispose(bool disposing)
        {
            if (!this._isDisposed)
            {
                if (disposing)
                {
                    if (this.Socket != null)
                    {
                        this.Socket.OnRecieved -= this.OnRecieved;
                        this.Socket.Dispose();
                    }

                    this.Socket = null;
                }

                this._isDisposed = true;
            }
        }

        public void Dispose()
        {
            this.Dispose(true);
        }
        #endregion

    }
}
