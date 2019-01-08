/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Models/IEntity.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Views.Controls {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import IEntity = Fw.Models.IEntity;

    export interface IMainButtonView extends Views.IView {
        readonly Button: Views.ButtonView;
        readonly Label: Views.LabelView;
        Value: any;
        readonly Entity: IEntity;

        ApplyByEntity(): void;
    }
}
