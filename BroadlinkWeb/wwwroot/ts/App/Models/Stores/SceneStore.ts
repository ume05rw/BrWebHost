/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../../Items/ControlSetTemplate.ts" />
/// <reference path="../Entities/Scene.ts" />
/// <reference path="../Entities/SceneDetail.ts" />
/// <reference path="../Entities/Header.ts" />
/// <reference path="../Entities/Job.ts" />
/// <reference path="ControlStore.ts" />
/// <reference path="../../Items/Lang/Lang.ts" />
/// <reference path="../../Items/ValidationFailType.ts" />

namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import SceneDetails = App.Models.Stores.SceneDetails;
    import Xhr = Fw.Util.Xhr;
    import Scene = App.Models.Entities.Scene;
    import SceneDetail = App.Models.Entities.SceneDetail;
    import Header = App.Models.Entities.Header;
    import Job = App.Models.Entities.Job;
    import Lang = App.Items.Lang.Lang;
    import ValidationFailType = App.Items.ValidationFailType;

    export class SceneStore extends Fw.Models.StoreBase<Scene> {

        private static _instance: SceneStore = null;
        public static get Instance(): SceneStore {
            if (SceneStore._instance === null)
                SceneStore._instance = new SceneStore();

            return SceneStore._instance;
        }

        protected constructor() {
            super();

            this.SetClassName('SceneStore');
            this.EnableLog = true;
        }

        protected GetNewEntity(): Scene {
            return new Scene();
        }

        public async GetList(): Promise<Scene[]> {

            const params = new Xhr.Params(
                'Scenes',
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                const list = res.Values as Scene[];
                _.each(list, (entity: Scene) => {
                    const obj = this.Merge(entity);

                    // API応答値を、TS側Entityに整形して保持しておく。
                    if (entity.Details && entity.Details.length > 0) {
                        SceneDetails.SetRange(entity.Details);
                        let details = SceneDetails.GetListBySceneId(entity.Id);

                        obj.Details = _.sortBy(details, (detail: SceneDetail) => {
                            return detail.Order;
                        });
                    } else {
                        obj.Details = [];
                    }
                });

                return _.values(this.List);
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);

                return [];
            }
        }

        public async UpdateHeader(entity: Scene): Promise<boolean> {

            const header = new Header();
            header.Id = entity.Id;
            header.Order = entity.Order;

            const params = new Xhr.Params(
                `Scenes/UpdateHeader/${header.Id}`,
                Xhr.MethodType.Post,
                header
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                return true;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);

                return false;
            }
        }

        public async UpdateHeaders(entities: Scene[]): Promise<boolean> {

            const headers = new Array<Header>();

            _.each(entities, (entity: Scene) => {
                const header = new Header();
                header.Id = entity.Id;
                header.Order = entity.Order;
                headers.push(header);
            });

            const params = new Xhr.Params(
                `Scenes/UpdateHeader`,
                Xhr.MethodType.Post,
                headers
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                return true;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);

                return false;
            }
        }

        public async Write(entity: Scene): Promise<Scene> {

            const params = new Xhr.Params(
                'Scenes',
                Xhr.MethodType.Post,
                entity
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                const id = (res.Values as Scene).Id;

                this.Merge(res.Values as Scene);

                const result = this.List[id];

                // API応答値を、TS側Entityに整形して保持しておく。
                if (res.Values.Details && res.Values.Details.length > 0) {
                    SceneDetails.SetRange(res.Values.Details);
                    result.Details = SceneDetails.GetListBySceneId(id);
                } else {
                    result.Details = [];
                }

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Remove(entity: Scene): Promise<boolean> {

            const params = new Xhr.Params(
                `Scenes/${entity.Id}`,
                Xhr.MethodType.Delete,
                entity
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                _.each(entity.Details, (c) => {
                    delete SceneDetails.List[c.Id];
                });

                delete this.List[entity.Id];

                return true;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return false;
            }
        }

        public async Exec(entity: Scene): Promise<Job> {

            const params = new Xhr.Params(
                `Scenes/Exec/${entity.Id}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                let job: Job = res.Values as Job;
                job = await Stores.Jobs.Get(job.Id);
                if (!job) {
                    this.Log('Job Query Fail');
                    this.Log(res.Errors);
                    return null;
                }

                return job;

            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Validate(scene: Scene): Promise<Array<Entities.ValidationResult>> {
            let errors = new Array<Entities.ValidationResult>();

            // 要注意。_.each内でawaitしても、処理終了を待たないで続行してしまう。一つずつfor文でawaitする。
            for (let i = 0; i < scene.Details.length; i++) {
                const detail = scene.Details[i];
                const errs = await Stores.SceneDetails.Validate(detail);
                if (errs.length > 0)
                    errors = errors.concat(errs);
            }

            return errors;
        }
    }

    export const Scenes: SceneStore = SceneStore.Instance;
}
