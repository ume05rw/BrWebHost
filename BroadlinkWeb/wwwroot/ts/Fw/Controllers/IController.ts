/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="../IObject.ts" />

/// <reference path="../Views/IView.ts" />

namespace Fw.Controllers {
    export interface IController extends IObject {

        readonly Id: string;
        readonly IsDefaultView: boolean;
        readonly View: Fw.Views.PageView;
        readonly Manager: Fw.Controllers.Manager;

        SetPageView(view: Views.PageView): void;
        SetPageViewByJQuery(elem: JQuery): void;

        SwitchTo(id: string): void;
        SwitchController(controller: IController): void;
        SetModal(): void;
        HideModal(): void;
        SetUnmodal(): void;
    }
}
