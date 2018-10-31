/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;

    export class Scene extends Fw.Models.EntityBase {

        public Name: string = 'New Scene';

        public IconUrl: string = 'images/icons/scene/scene.png';

        public Color: string = Color.ButtonColors[8];

        public Order: number = 99999;

        public Details: Array<SceneDetail> = [];
    }
}
