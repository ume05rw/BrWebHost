/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controller {
    export interface IController {
        Id: string;
        IsDefaultView: boolean;
        View: JQuery;
    }
}

