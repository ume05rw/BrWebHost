/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Controllers {
    export interface IController {
        Id: string;
        IsDefaultView: boolean;
        View: JQuery;
    }
}

