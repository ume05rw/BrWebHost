/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../../lib/MagnificPopup/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />
/// <reference path="PopupBase.ts" />

namespace App.Views.Popup {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;

    export class Confirm extends PopupBase {

        private static _instance: Confirm = null;
        public static get Instance(): Confirm {
            if (!Confirm._instance)
                Confirm._instance = new Confirm();

            return Confirm._instance;
        }


        protected constructor() {
            super('');

            this.ShowCloseBtn = false;
            this.CloseOnBgClick = false;
            this.EnableEscapeKey = false;
        }
    }
}