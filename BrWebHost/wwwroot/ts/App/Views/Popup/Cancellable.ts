/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../../lib/MagnificPopup/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="PopupBase.ts" />

namespace App.Views.Popup {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;

    export class CancellablePopup extends PopupBase {

        private static _instance: CancellablePopup = null;
        public static get Instance(): CancellablePopup {
            if (!CancellablePopup._instance)
                CancellablePopup._instance = new CancellablePopup();

            return CancellablePopup._instance;
        }

        private _callbackCancel: Function;

        protected constructor() {
            super($('#PtplCancellable'));

            this.CloseOnBgClick = false;
            this.ShowCloseBtn = false;
            this.EnableEscapeKey = false;

            this.Elem.find('.ButtonCancel').on('click', () => {
                this.Close();

                if (this._callbackCancel)
                    this._callbackCancel();
            });
        }

        public Open(params?: any): void {
            if (typeof params === 'object') {
                this._callbackCancel = _.isFunction(params.CallbackCancel)
                    ? params.CallbackCancel
                    : null;
            }

            super.Open(params)
        }
    }

    export const Cancellable: CancellablePopup = CancellablePopup.Instance;
}
