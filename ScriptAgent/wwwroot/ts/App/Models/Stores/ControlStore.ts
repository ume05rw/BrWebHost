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


        protected constructor() {
            super();

            this.SetClassName('ControlStore');
            //this.EnableLog = true;
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

        public Validate(operationType: OperationType, control: Control): Array<Entities.ValidationResult> {
            const errors = new Array<Entities.ValidationResult>();

            const err3 = this.ValidateScript(control);
            if (err3 !== true)
                errors.push(err3);
            return errors;
        }

        public ValidateScript(control: Control): Entities.ValidationResult | true {
            return (control.Code && control.Code !== '')
                ? true
                : new Entities.ValidationResult(control, 'Code', Lang.ScriptNull + ` [${control.Name}]`);
        }
    }

    export const Controls: ControlStore = ControlStore.Instance;
}
