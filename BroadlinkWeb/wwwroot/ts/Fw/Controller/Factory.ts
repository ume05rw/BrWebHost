/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controller {
    export class Factory {
        // https://qiita.com/kojiy72/items/8e3ac6ae2083d3e1284c
        public static GetViewClass(name: string) {
            return Function('return (App.Controller.' + name + 'Controller)')();
        }
    }
}