/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/Num.ts" />
/// <reference path="InputViewBase.ts" />
/// <reference path="Property/FitPolicy.ts" />

namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Events = Fw.Events.ViewEvents;

    export class SelectBoxInputView extends InputViewBase {

        public get IsReadOnly(): boolean {
            return this._isReadOnly;
        }
        public set IsReadOnly(value: boolean) {
            const changed = (this._isReadOnly !== value);

            if (changed) {
                this._isReadOnly = value;
                this.Elem.children().each((idx, elem) => {
                    const $elem = $(elem);
                    const selected = $elem.prop('selected');
                    if (selected === true) {
                        // 常に有効
                        $elem.prop('disabled', false);
                    } else {
                        // 無効化制御
                        $elem.prop('disabled', this._isReadOnly);
                    }
                });
            }
        }

        constructor() {
            super($('<select></select>'));

            this.SetClassName('SelectBoxInputView');
            this.Elem.addClass(this.ClassName);

            this.AddItem('', '');
        }

        public AddItem(name: string, value: string): void {
            //this.Log('name: ' + name);
            //this.Log(`<option value="${value}">${name}</option>`);
            const option = $(`<option value="${value}"></option>`);
            option.html(name);
            this.Elem.append(option);
        }

        public ClearItems(): void {
            this.Elem.find('option').remove();
            this.AddItem('', '');
        }
    }
}
