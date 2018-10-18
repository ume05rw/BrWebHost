/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Util {
    export enum LogMode {
        Console = 1,
        Window = 2
    }
    export class Dump {

        private static _logMode: LogMode = LogMode.Console;
        public static get LogMode(): LogMode {
            return Dump._logMode;
        }
        public static set LogMode(value: LogMode) {
            const changed = (Dump._logMode !== value);
            Dump._logMode = value;

            if (changed) {
                if (Dump._logMode === LogMode.Window) {
                    if (!Dump._logParams.isLogWindowReady)
                        Dump.InitLogWindow();

                    Dump.ShowLogWindow();
                } else {
                    Dump.HideLogWindow();
                }
            }
        }
        

        public static Log(value: any) {
            if (Dump._logMode === LogMode.Console) {
                try {
                    console.log(`${Dump.GetTimestamp()} :: ${Dump.GetDumpedString(value)}`);
                } catch (e) {
                    // 引数の循環参照など
                    console.log(`${Dump.GetTimestamp()} ::`);
                    console.log(value);
                }
            } else {
                Dump.WriteObjectToLogWindow(value);
            }
        }

        public static ErrorLog(value: any, message?: string) {
            if (Dump._logMode === LogMode.Console) {
                console.log('');
                console.log('########################################');
                console.log('########################################');
                console.log(`${Dump.GetTimestamp()} :: ERROR!! ${(message ? '[ ' + message + ' ]' : '')}`);
                console.log(value);
            } else {
                Dump.WriteObjectToLogWindow(`ERROR!! ${(message ? '[ ' + message + ' ]' : '')}`);
                Dump.WriteObjectToLogWindow(value);
            }
            // なぜか、Firefoxで例外オブジェクトがシリアライズ出来ず、例外も出ない。
            //try {
            //    console.log(Dump.GetDumpedString(value));
            //} catch (e) {
            //    console.log(value);
            //}
        }

        private static GetTimestamp(): string {
            const now = new Date();
            return `${('0' + now.getHours()).slice(-2)}:${('0' + now.getMinutes()).slice(-2)}:${('0' + now.getSeconds()).slice(-2)}.${('000' + now.getMilliseconds()).slice(3)}`;
        }

        private static GetDumpedString(value: any): string {
            return _.isObject(value)
                ? '\n' + JSON.stringify(value, null, "\t")
                : String(value);
        }

        private static _logParams: any = {
            isLogWindowDraging: false,
            pointerX: null,
            pointerY: null,
            windowX: null,
            windowY: null,
            isEnableLog: true,
            isEnableTimeStamp: true,
            isLogWindowReady: false
        };

        private static InitLogWindow(): void {
            var me = this,
                elmLogWindow = document.getElementById("DOBES_LOG"),
                body, parent, title;

            if (!elmLogWindow) {
                //Bodyが取得できないことはあり得ない想定。
                body = document.getElementsByTagName("body");

                try {
                    elmLogWindow = document.createElement("div");
                    elmLogWindow.id = "DOBES_LOG";
                    parent = document.createElement("div");
                    title = document.createElement("div");
                    parent.style.zIndex = 99999999;
                    parent.id = "DOBES_LOG_WINDOW";
                    title.innerHTML =
                        "<div>"
                        + "<div style='float:left; width: 100px; text-align: left;'>"
                        + "<strong>LOG</strong>"
                        + "</div>"
                        + "<div style='float:left;'>"
                        + "</div>"
                        + "<div style='clear:both;'></div>"
                        + "</div>";
                    title.style.border = "2px solid #000000";
                    title.style.textAlign = "center";
                    title.style.padding = "4px";
                    title.style.backgroundColor = "#eeeeee";

                    const getMousePosition = function (e) {
                        return (e ?
                            {
                                x: e.pageX,
                                y: e.pageY
                            }
                            : {
                                x: 0,
                                y: 0
                            }
                        );
                    };

                    title.onmousedown = function (e) {
                        var objPos = getMousePosition(e);

                        me._logParams.windowX = parseInt(parent.style.left.replace("px"), 10);
                        me._logParams.windowY = parseInt(parent.style.top.replace("px"), 10);
                        me._logParams.pointerX = objPos.x;
                        me._logParams.pointerY = objPos.y;
                        me._logParams.isLogWindowDraging = true;
                    };

                    title.ondblclick = function () {
                        me.HideLogWindow();
                    };
                    title.onmouseup = function () {
                        me._logParams.isLogWindowDraging = false;
                    };
                    body[0].onmousemove = function (e) {
                        if (!me._logParams.isLogWindowDraging) { return; }
                        var objPos = getMousePosition(e);

                        var addX = (objPos.x - me._logParams.pointerX);
                        var addY = (objPos.y - me._logParams.pointerY);

                        parent.style.left = (me._logParams.windowX + addX) + "px";
                        parent.style.top = (me._logParams.windowY + addY) + "px";
                    };

                    parent.appendChild(title);
                    parent.appendChild(elmLogWindow);
                    parent.style.position = "absolute";
                    parent.style.top = "5px";
                    parent.style.left = "5px";
                    body[0].insertBefore(parent, body[0].firstChild);

                } catch (e) {
                    alert("Log Window Create Fail. e:" + e.message);
                    return;
                }
            }

            //旧IE対応めんどいのでTry-Catch
            try {
                //表示位置・サイズセット
                elmLogWindow.style.zIndex = "100";
                elmLogWindow.style.border = "1px solid #000000";
                elmLogWindow.style.width = "300px";
                elmLogWindow.style.height = "700px";
                elmLogWindow.style.fontSize = "9pt";
                elmLogWindow.style.overflow = "scroll";
                elmLogWindow.style.backgroundColor = "#ffffff";
            } catch (ex) {
                console.log(ex);
            }

            Dump._logParams.isLogWindowReady = true;
        }

        private static ShowLogWindow(): void {
            var elmLogWindow = document.getElementById("DOBES_LOG");
            if (!elmLogWindow)
                throw new Error('Log-Window not initialized.');
        
            try {
                elmLogWindow = document.getElementById("DOBES_LOG_WINDOW");
                elmLogWindow.style.visibility = "visible";
                elmLogWindow.style.display = "block";
            } catch (ex) {
                console.log(ex);
            }
        }

        private static HideLogWindow(): void {
            var elmLogWindow = document.getElementById("DOBES_LOG");
            if (!elmLogWindow)
                return;

            try {
                elmLogWindow = document.getElementById("DOBES_LOG_WINDOW");
                elmLogWindow.style.visibility = "hidden";
                elmLogWindow.style.display = "none";
            } catch (ex) {
                console.log(ex);
            }
        }

        private static WriteToLogWindow(message): void {
            var me = this;
            if (!Dump._logParams.isEnableLog)
                return;

            if (!Dump._logParams.isLogWindowReady)
                Dump.InitLogWindow();

            var date = new Date();

            try {
                var objLog = document.getElementById("DOBES_LOG");
                message = String(message);
                var txtNode = document.createTextNode(
                    (
                        Dump._logParams.isEnableTimeStamp ?
                            date.getHours()
                            + ":" + date.getMinutes()
                            + ":" + date.getSeconds()
                            + "." + date.getMilliseconds()
                            + " :: "
                            : ""
                    )
                    + message
                );

                var br = document.createElement("br");
                if (objLog.childNodes.length != 0) {
                    objLog.insertBefore(br, objLog.childNodes[0]);
                } else {
                    objLog.appendChild(br);
                }
                objLog.insertBefore(txtNode, objLog.childNodes[0]);
            } catch (e) {
                console.log(e);
            }
        }

        private static WriteObjectToLogWindow(obj: any): void {
            Dump.WriteToLogWindow(Dump.BuildJson(obj));
        }

        private static BuildJson(obj, opts = null): string {
            var _opts = { //デフォルトオプション定義
                    maxDepth: 3
                };

            //渡し値のオプション値で、デフォルトオプション定義を上書きする。
            for (var key in opts)
                _opts[key] = opts[key];

            //階層指定範囲を、1～100までに限定する。
            var depth = parseInt(String(_opts.maxDepth));
            _opts.maxDepth = (depth > 0)
                ? ((depth < 100)
                    ? depth
                    : 100)
                : 1;

            //特定の文字を置換する。
            var aryTargetStrings = [[/\\/g, "\\\\"], [/\n/g, "\\n"], [/\r/g, "\\r"], [/\t/g, "\\t"], [/(")/g, "\\$1"]];
            var formatString = function (value) {

                for (var i = 0; i < aryTargetStrings.length; i++) {
                    value = value.replace.apply(value, aryTargetStrings[i]);
                }
                return value;
            };

            //渡し値の型によって戻り値の内容表現を変える。(含再帰処理)
            var makeDump = function (value, currentDepth) {
                //console.log("makeDump value= " + value);
                //console.log("makeDump typeof= " + (typeof value));

                if (currentDepth >= _opts.maxDepth)
                    return "*over*";

                if (value === null)
                    return 'null';

                switch (typeof value) {
                    case 'undefined':
                        return '"undefined"';
                    case 'boolean':
                        return value ? 'true' : 'false';
                    case 'function':
                        return '"function()"';  //value.toSource()
                    case 'string':
                        return '"' + formatString(value) + '"';
                    case 'number':
                        return formatString(String(value));
                    case 'object':
                        //HTMLElementか否かを判定
                        if (value instanceof HTMLElement)
                            return '"HTML-Element"';

                        var aryResult = [];
                        var aryKey = [];

                        if (value instanceof Array) {
                            //渡し値が配列のとき
                            if ((currentDepth + 1) >= _opts.maxDepth)
                                return "[\"*depth-over*\"]";

                            for (var key in value)
                                aryKey.push(key);

                            for (var i = 0; i < aryKey.length; i++) {
                                aryResult.push(
                                    makeDump(value[aryKey[i]], currentDepth + 1)
                                );
                            }
                            return '[' + aryResult.join(', ') + ']';
                        } else {
                            //渡し値がオブジェクトのとき
                            if ((currentDepth + 1) >= _opts.maxDepth)
                                return "{\"*depth-over*\": \"*depth-over*\"}";

                            for (var key in value)
                                aryKey.push(key);

                            for (var i = 0; i < aryKey.length; i++) {
                                aryResult.push(
                                    makeDump(aryKey[i], currentDepth + 1)
                                    + ':'
                                    + makeDump(value[aryKey[i]], currentDepth + 1)
                                );
                            }
                            return '{' + aryResult.join(', ') + '}';
                        }


                    default:
                        return formatString(String(value));
                }
            };
            //ダンプ文字列を生成する。
            return makeDump(obj, 0);
        }
    }
}