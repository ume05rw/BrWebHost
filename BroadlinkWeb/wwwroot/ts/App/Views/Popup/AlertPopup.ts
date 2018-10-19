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

    export class AlertPopup extends PopupBase {

        private static _instance: AlertPopup = null;
        public static get Instance(): AlertPopup {
            if (!AlertPopup._instance)
                AlertPopup._instance = new AlertPopup();

            return AlertPopup._instance;
        }

        protected constructor() {
            super($('#PtplAlert'));

            this.CloseOnContentClick = true;
            this.CloseOnBgClick = true;
            this.ShowCloseBtn = false;
            this.EnableEscapeKey = true;
        }
    }

    export const Alert: AlertPopup = AlertPopup.Instance;
}