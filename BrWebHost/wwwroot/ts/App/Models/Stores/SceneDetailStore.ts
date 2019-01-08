/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/SceneDetail.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />
/// <reference path="../../Items/ValidationFailType.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import SceneDetail = App.Models.Entities.SceneDetail;
    import Xhr = Fw.Util.Xhr;
    import Lang = App.Items.Lang.Lang;
    import ValidationFailType = App.Items.ValidationFailType;

    export class SceneDetailStore extends Fw.Models.StoreBase<SceneDetail> {

        private static _instance: SceneDetailStore = null;
        public static get Instance(): SceneDetailStore {
            if (SceneDetailStore._instance === null)
                SceneDetailStore._instance = new SceneDetailStore();

            return SceneDetailStore._instance;
        }


        protected constructor() {
            super();

            this.SetClassName('SceneDetailStore');
            //this.EnableLog = true;
        }

        protected GetNewEntity(): SceneDetail {
            return new SceneDetail();
        }

        public async Write(entity: SceneDetail): Promise<SceneDetail> {
            throw new Error('Not Supported');
        }

        public SetRange(entities: SceneDetail[]): void {
            _.each(entities, (c) => {
                this.Merge(c);
            });
        }

        public GetListBySceneId(id: number): Array<SceneDetail> {
            const result = new Array<SceneDetail>();
            _.each(this.List, (entity: SceneDetail) => {
                if (entity.SceneId === id)
                    result.push(entity);
            });
            return result;
        }

        public Validate(index: number, detail: SceneDetail): Array<Entities.ValidationResult> {
            let errors = new Array<Entities.ValidationResult>();

            if (!detail.ControlSetId || detail.ControlSetId === 0) {
                errors.push(new Entities.ValidationResult(
                    detail,
                    'ControlSetId',
                    Lang.OperationNotSelected + ` No.[${(index + 1)}]`)
                );
            }

            if (!detail.ControlId || detail.ControlId === 0) {
                errors.push(new Entities.ValidationResult(
                    detail,
                    'ControlId',
                    Lang.OperationDetailNotSelected + ` No.[${(index + 1)}]`)
                );
            }

            return errors;
        }
    }

    export const SceneDetails: SceneDetailStore = SceneDetailStore.Instance;
}
