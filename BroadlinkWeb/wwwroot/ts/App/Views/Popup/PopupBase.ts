/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../../lib/MagnificPopup/index.d.ts" />
/// <reference path="../../../Fw/Views/ButtonView.ts" />
/// <reference path="../../../Fw/Views/Property/Anchor.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />

namespace App.Views.Popup {
    import Dump = Fw.Util.Dump;
    import Views = Fw.Views;
    import Property = Fw.Views.Property;

    export abstract class PopupBase {

        public Elem: JQuery;
        protected MsgElem: JQuery;
        public CloseOnContentClick: boolean;
        public CloseOnBgClick: boolean;
        public ShowCloseBtn: boolean;
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
        protected constructor(jqueryElem?: JQuery) {
            this.Elem = null;
            this.MsgElem = null;

            this._isOpen = false;
            this.CloseOnContentClick = false;
            this.CloseOnBgClick = true;
            this.ShowCloseBtn = true;
            this.EnableEscapeKey = true;

            this.SetElem(jqueryElem);
        }

        protected SetElem(jqueryElem: JQuery) {
            if (!jqueryElem)
                return;

            this.Elem = jqueryElem;
            this.MsgElem = this.Elem.find('.Message');
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

                    if (key === 'items' && val && val.src) {
                        if (val.src instanceof jQuery)
                            this.Elem = val.src;
                        else
                            this.Elem = $(val.src);
                    }

                    if (key === 'Message')
                        this.MsgElem.html(val);
                });
            }

            const _params = {
                items: {
                    src: this.Elem,
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
