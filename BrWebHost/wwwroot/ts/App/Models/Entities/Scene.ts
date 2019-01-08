/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />
/// <reference path="../../Items/Icon.ts" />
/// <reference path="../../Items/OperationType.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;
    import Icon = App.Items.Icon;
    import OperationTemplate = App.Items.OperationTemplate;
    import Lang = App.Items.Lang.Lang;

    export class Scene extends Fw.Models.EntityBase {

        public Name: string = Lang.NewScene;

        public IconUrl: string = Icon.GetByOperationTemplate(OperationTemplate.Scene, true);

        public Color: string = Color.ButtonColors[8];

        public Order: number = 99999;

        public Details: Array<SceneDetail> = [];
    }
}
