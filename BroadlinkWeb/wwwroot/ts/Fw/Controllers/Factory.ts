﻿/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="IController.ts" />

namespace Fw.Controllers {
    import Dump = Fw.Util.Dump;

    export class Factory {
        // https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
        public static Create(name: string, elem: JQuery, manager: Manager): IController {
            // 文字列からクラスを取得
            const classObject = Function('return (App.Controllers.' + name + 'Controller)')();
            const instance = new classObject(elem, manager);
            return instance;
        }
    }
}