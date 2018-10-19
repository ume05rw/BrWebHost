/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../../lib/MagnificPopup/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Color.ts" />

namespace App.Views.Popup {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;
    import Color = App.Color;

    export abstract class PopupBase {

        public Src: string | JQuery;
        public CloseOnContentClick: boolean;
        public ShowCloseBtn: boolean;
        public CloseOnBgClick: boolean;
        public EnableEscapeKey: boolean;

        private _isOpen: boolean;
        public get IsOpen(): boolean {
            return this._isOpen;
        }

        /**
         * @description コンストラクタ
         * @see ポップアップは重複しないため、Singleton実装を強制する。
         * @param src
         */
        protected constructor(src?: string | JQuery) {
            this.Src = (src)
                ? src
                : null;

            this._isOpen = false;
            this.CloseOnContentClick = false;
            this.ShowCloseBtn = true;
            this.CloseOnBgClick = true;
            this.EnableEscapeKey = true;
        }

        public Open(params?: any): void {
            // クラスに組み込み済みのプロパティは引数から拾っておく。
            if (params) {
                _.each(params, (val: any, key: any) => {
                    if (key === 'closeOnContentClick')
                        this.CloseOnContentClick = (val !== false);
                    if (key === 'showCloseBtn')
                        this.ShowCloseBtn = (val !== false);
                    if (key === 'closeOnBgClick')
                        this.CloseOnBgClick = (val !== false);
                    if (key === 'enableEscapeKey')
                        this.EnableEscapeKey = (val !== false);

                    if (key === 'items' && val && val.src)
                        this.Src = val.src;
                });
            }

            const _params = {
                items: {
                    src: this.Src,
                },
                type: 'inline',
                closeOnContentClick: this.CloseOnContentClick,
                showCloseBtn: this.ShowCloseBtn,
                closeOnBgClick: this.CloseOnBgClick,
                enableEscapeKey: this.EnableEscapeKey,
            };

            if (params)
                _.extend(_params, params);

            $.magnificPopup.open(_params);
            this._isOpen = true;
        }

        public Close(): void {
            $.magnificPopup.close();
            this._isOpen = false;
        }
    }

}