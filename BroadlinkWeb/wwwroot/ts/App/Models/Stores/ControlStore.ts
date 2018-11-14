/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/Control.ts" />
/// <reference path="../../Items/OperationType.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />
/// <reference path="../../Items/ValidationFailType.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import Control = App.Models.Entities.Control;
    import Xhr = Fw.Util.Xhr;
    import OperationType = App.Items.OperationType;
    import Lang = App.Items.Lang.Lang;
    import ValidationFailType = App.Items.ValidationFailType;

    export class ControlStore extends Fw.Models.StoreBase<Control> {

        private static _instance: ControlStore = null;
        public static get Instance(): ControlStore {
            if (ControlStore._instance === null)
                ControlStore._instance = new ControlStore();

            return ControlStore._instance;
        }


        private _regPronto: RegExp;
        private _regMacAddr: RegExp;

        protected constructor() {
            super();

            this.SetClassName('ControlStore');
            this.EnableLog = true;

            this._regPronto = new RegExp('/^([a-fA-F0-9 ]+)$/');
            this._regMacAddr = new RegExp('/^([a-fA-F0-9-:]+)$/');
        }

        protected GetNewEntity(): Control {
            return new Control();
        }

        public async Write(entity: Control): Promise<Control> {
            throw new Error('Not Supported');
        }

        public SetRange(entities: Control[]): void {
            _.each(entities, (c) => {
                this.Merge(c);
            });
        }

        public GetListByControlSetId(id: number): Array<Control> {
            const result = new Array<Control>();
            _.each(this.List, (entity: Control) => {
                if (entity.ControlSetId === id)
                    result.push(entity);
            });
            return result;
        }

        public async Validate(operationType: OperationType, control: Control): Promise<Array<Entities.ValidationResult>> {
            const errors = new Array<Entities.ValidationResult>();

            switch (operationType) {
                case OperationType.RemoteControl:
                    // IR-Prontoコードの検証
                    const err1 = await this.ValidatePronto(control);
                    if (err1 !== true)
                        errors.push(err1);
                    break;
                case OperationType.BroadlinkDevice:
                    // バリデート対象なし
                    break;
                case OperationType.WakeOnLan:
                    // MACアドレスの検証
                    const err2 = await this.ValidateMacAddr(control);
                    if (err2 !== true)
                        errors.push(err2);
                    break;
                case OperationType.Script:
                    // 未入力の検証
                    const err3 = await this.ValidateScript(control);
                    if (err3 !== true)
                        errors.push(err3);
                    break;
                case OperationType.RemoteHostScript:
                    // 未選択の検証
                    const err4 = await this.ValidateRemoteHostScript(control);
                    if (err4 !== true)
                        errors.push(err4);
                    break;
                case OperationType.Scene:
                default:
                    // ここには来ないはず。
                    alert('なんでやー');
                    throw new Error('なんでやー');
            }

            return errors;
        }

        public async ValidatePronto(control: Control): Promise<Entities.ValidationResult | true> {
            if (control.Code === '')
                return true;

            return (this._regPronto.test(control.Code))
                ? true
                : new Entities.ValidationResult(control, 'Code', Lang.InvalidProntoCode + ` [${control.Name}]`);
        }

        public async ValidateMacAddr(control: Control): Promise<Entities.ValidationResult | true> {

            if (control.Code === '')
                return true;

            if (!this._regMacAddr.test(control.Code)) {
                return new Entities.ValidationResult(control, 'Code', Lang.InvalidMacChar + ` [${control.Name}]`);
            }

            if (control.Code.indexOf('-') >= 0) {
                const hexs = control.Code.split('-');
                if (hexs.length !== 6)
                    return new Entities.ValidationResult(control, 'Code', Lang.InvalidMacFormat + ` [${control.Name}]`);
            } else if (control.Code.indexOf(':') >= 0) {
                const hexs = control.Code.split(';');
                if (hexs.length !== 6)
                    return new Entities.ValidationResult(control, 'Code', Lang.InvalidMacFormat + ` [${control.Name}]`);
            } else {
                return new Entities.ValidationResult(control, 'Code', Lang.InvalidMacFormat + ` [${control.Name}]`);
            }
        }

        public async ValidateScript(control: Control): Promise<Entities.ValidationResult | true> {
            return (control.Code && control.Code !== '')
                ? true
                : new Entities.ValidationResult(control, 'Code', Lang.ScriptNull + ` [${control.Name}]`);
        }

        public async ValidateRemoteHostScript(control: Control): Promise<Entities.ValidationResult | true> {
            return (control.Code && control.Code !== '')
                ? true
                : new Entities.ValidationResult(control, 'Code', Lang.RemoteScriptNull + ` [${control.Name}]`);
        }
    }

    export const Controls: ControlStore = ControlStore.Instance;
}
