using System;
using System.Linq;
using System.Threading.Tasks;

namespace UdpReplyer
{
    class Program
    {
        private static int _port = 5081;
        private static Replyer _replyer;
        private static EventHandler _exitHandler = new EventHandler(Program.OnExit);
        private static bool _isExited = false;


        static void Main(string[] args)
        {
            AppDomain.CurrentDomain.ProcessExit += Program._exitHandler;

            foreach (var arg in args)
            {
                if (Xb.Num.IsNumeric(arg))
                {
                    Program._port = (int)Double.Parse(arg);
                    Xb.Util.Out($"Port Setted: {Program._port}");
                    break;
                }
            }

            Program.Start()
                .ConfigureAwait(false)
                .GetAwaiter()
                .GetResult();
        }

        static async Task<bool> Start()
        {
            try
            {
                Program._replyer = new Replyer(Program._port);

                while (true)
                {
                    if (Program._isExited)
                        break;

                    await Task.Delay(1000).ConfigureAwait(false);
                }

                if (Program._replyer != null)
                    Program._replyer.Dispose();
            }
            catch (Exception ex)
            {
                Xb.Util.Out("Replyer Failed!");
                Xb.Util.Out(ex);

                // Program._replyer がnullのときは、初回起動に失敗している可能性がある。
                // 重複ポートを使用できずに落ちる場合など。
                // 初回起動失敗時はそのままプログラムを終了するようにする。
                if (Program._replyer != null && Program._isExited)
                {
                    await Task.Delay(5000).ConfigureAwait(false);
                    await Program.Start().ConfigureAwait(false);
                }
            }

            return true;
        }


        private static void OnExit(object sender, EventArgs e)
        {
            Xb.Util.Out("Replyer Exit");

            AppDomain.CurrentDomain.ProcessExit -= Program._exitHandler;
            if (Program._replyer != null)
                Program._replyer.Dispose();

            Program._isExited = true;
            Program._replyer = null;
        }
    }
}
