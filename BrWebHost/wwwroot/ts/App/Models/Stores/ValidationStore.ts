/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/Control.ts" />
/// <reference path="../Entities/Scene.ts" />
/// <reference path="../Entities/SceneDetail.ts" />
/// <reference path="../Entities/Schedule.ts" />
/// <reference path="../Entities/ValidationResult.ts" />
/// <reference path="../../Items/OperationType.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />
/// <reference path="../../Items/ValidationFailType.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Control = App.Models.Entities.Control;
    import Scene = App.Models.Entities.Scene;
    import SceneDetail = App.Models.Entities.SceneDetail;
    import Schedule = App.Models.Entities.Schedule;
    import ValidationResult = App.Models.Entities.ValidationResult;
    import Xhr = Fw.Util.Xhr;
    import OperationType = App.Items.OperationType;
    import Lang = App.Items.Lang.Lang;

    import ValidationFailType = App.Items.ValidationFailType;

    export class ValidationStore extends Fw.Models.StoreBase<ValidationResult> {

        private static _instance: ValidationStore = null;
        public static get Instance(): ValidationStore {
            if (ValidationStore._instance === null)
                ValidationStore._instance = new ValidationStore();

            return ValidationStore._instance;
        }



        public Write(entity: ValidationResult): void {
            throw new Error("Method not implemented.");
        }
        protected GetNewEntity(): ValidationResult {
            throw new Error("Method not implemented.");
        }


        public Validate(entity: ControlSet | Scene | Schedule): Array<Entities.ValidationResult> {
            if (entity instanceof ControlSet) {
                return Stores.ControlSets.Validate(entity);
            } else if (entity instanceof Scene) {
                return Stores.Scenes.Validate(entity);
            } else if (entity instanceof Schedule) {
                return Stores.Schedules.Validate(entity);
            } else {
                // ここには来ないはず。
                alert('なんでやー');
                throw new Error('なんでやー');
            }
        }

        public HasError(errors: Array<Entities.ValidationResult>): boolean {
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].Type === ValidationFailType.Error)
                    return true;
            }

            return false;
        }

        public HasWarning(errors: Array<Entities.ValidationResult>): boolean {
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].Type === ValidationFailType.Warning)
                    return true;
            }

            return false;
        }

        public GetFirstError(errors: Array<Entities.ValidationResult>): Entities.ValidationResult {
            for (let i = 0; i < errors.length; i++) {
                if (errors[i].Type === ValidationFailType.Error)
                    return errors[i];
            }

            return null;
        }

        public GetMessage(errors: Array<Entities.ValidationResult>): string {
            let hasError = false;
            let hasWarning = false;

            const errs = new Array<string>();
            const warns = new Array<string>();

            _.each(errors, (err: Entities.ValidationResult) => {
                if (err.Type === ValidationFailType.Error) {
                    hasError = true;
                    errs.push('・' + err.Message + '<br/>');
                }
                if (err.Type === ValidationFailType.Warning) {
                    hasWarning = true;
                    warns.push('・' + err.Message + '<br/>');
                }
            });

            let result = '';

            if (hasError && hasWarning) {
                result = Lang.ErrorsAndWarnings + '<br/><br/>';
                result += '　' + Lang.Errors + ':<br/>';
                result += errs.join('');
                result += '<br/>';
                result += '　' + Lang.Warnings + ':<br/>';
                result += warns.join('');
                result += '<br/>';

            } else if (hasError) {
                result = 'Errors<br/><br/>';
                result += errs.join('');
                result += '<br/>';
            } else if (hasWarning) {
                result = 'Warnings<br/><br/>';
                result += warns.join('');
                result += '<br/>';
            } else {
                return '';
            }

            return result;
        }
    }

    export const Validations: ValidationStore = ValidationStore.Instance;
}
