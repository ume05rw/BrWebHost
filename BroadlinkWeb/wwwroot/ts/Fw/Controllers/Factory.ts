/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="./IController.ts" />

namespace Fw.Controllers {
    export class Factory {
        // https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
        public static Create(name: string, elem: JQuery, manager: Manager): IController {
            let classObject = Function('return (App.Controllers.' + name + 'Controller)')();
            let instance = new classObject(elem, manager);
            return instance;
        }
    }
}