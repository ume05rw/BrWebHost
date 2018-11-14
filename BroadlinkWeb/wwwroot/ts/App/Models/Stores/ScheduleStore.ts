/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../../Items/ControlSetTemplate.ts" />
/// <reference path="../Entities/Schedule.ts" />
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
    import Schedule = App.Models.Entities.Schedule;
    import Header = App.Models.Entities.Header;
    import Job = App.Models.Entities.Job;
    import Lang = App.Items.Lang.Lang;
    import ValidationFailType = App.Items.ValidationFailType;

    export class ScheduleStore extends Fw.Models.StoreBase<Schedule> {

        private static _instance: ScheduleStore = null;
        public static get Instance(): ScheduleStore {
            if (ScheduleStore._instance === null)
                ScheduleStore._instance = new ScheduleStore();

            return ScheduleStore._instance;
        }


        protected constructor() {
            super();

            this.SetClassName('SceneStore');
            this.EnableLog = true;
        }

        protected GetNewEntity(): Schedule {
            return new Schedule();
        }

        public async GetList(): Promise<Schedule[]> {

            const params = new Xhr.Params(
                'Schedules',
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                const list = res.Values as Schedule[];
                _.each(list, (entity: Schedule) => {
                    this.Merge(entity);
                });

                return _.values(this.List);
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);

                return [];
            }
        }

        public async UpdateHeader(entity: Schedule): Promise<boolean> {

            const header = new Header();
            header.Id = entity.Id;
            header.Order = entity.Order;

            const params = new Xhr.Params(
                `Schedules/UpdateHeader/${header.Id}`,
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

        public async UpdateHeaders(entities: Schedule[]): Promise<boolean> {

            const headers = new Array<Header>();

            _.each(entities, (entity: Schedule) => {
                const header = new Header();
                header.Id = entity.Id;
                header.Order = entity.Order;
                headers.push(header);
            });

            const params = new Xhr.Params(
                `Schedules/UpdateHeader`,
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

        public async Write(entity: Schedule): Promise<Schedule> {

            const params = new Xhr.Params(
                'Schedules',
                Xhr.MethodType.Post,
                entity
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                const id = (res.Values as Schedule).Id;

                this.Merge(res.Values as Schedule);
                const result = this.List[id];

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Remove(entity: Schedule): Promise<boolean> {

            const params = new Xhr.Params(
                `Schedules/${entity.Id}`,
                Xhr.MethodType.Delete,
                entity
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                delete this.List[entity.Id];

                return true;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return false;
            }
        }

        public Validate(schedule: Schedule): Array<Entities.ValidationResult> {
            let errors = new Array<Entities.ValidationResult>();

            if (
                (!schedule.SceneId || schedule.SceneId === 0)
                && (!schedule.ControlSetId || schedule.ControlSetId === 0)
                && (!schedule.ControlId || schedule.ControlId === 0)
            ) {
                // Scene, ControlSet, Control全部未入力
                errors.push(new Entities.ValidationResult(
                    schedule,
                    'SceneId',
                    Lang.NoOperations
                ));
            } else if (
                !(!schedule.SceneId || schedule.SceneId === 0)
                && (!schedule.ControlSetId || schedule.ControlSetId === 0)
                && (!schedule.ControlId || schedule.ControlId === 0)
            ) {
                // Sceneが入力され、ControlSet, Controlが未入力
                // 正しい。
            } else if (
                (!schedule.SceneId || schedule.SceneId === 0)
                && !(!schedule.ControlSetId || schedule.ControlSetId === 0)
                && !(!schedule.ControlId || schedule.ControlId === 0)
            ) {
                // Sceneが未入力、ControlSet, Controlが入力されている。
                // 正しい。
            } else if (
                (!schedule.SceneId || schedule.SceneId === 0)
                && !(!schedule.ControlSetId || schedule.ControlSetId === 0)
                && (!schedule.ControlId || schedule.ControlId === 0)
            ) {
                // Scene, Controlが未入力、ControlSetだけが入力されている。
                errors.push(new Entities.ValidationResult(
                    schedule,
                    'Control',
                    Lang.OperationDetailNotSelected
                ));
            } else if (
                (!schedule.SceneId || schedule.SceneId === 0)
                && (!schedule.ControlSetId || schedule.ControlSetId === 0)
                && !(!schedule.ControlId || schedule.ControlId === 0)
            ) {
                // Scene、ControlSetが未入力、Controlのみ入力されている。
                // ここに来ることはないはず。
                errors.push(new Entities.ValidationResult(
                    schedule,
                    'ControlSet',
                    Lang.OperationNotSelected
                ));
            }

            if (schedule.Enabled === true
                && schedule.WeekdayFlags === '0000000'
            ) {
                errors.push(new Entities.ValidationResult(
                    schedule,
                    'WeekdayFlags',
                    Lang.EnableButWeekdayNotSelected,
                    ValidationFailType.Warning
                ));
            }

            return errors;
        }
    }

    export const Schedules: ScheduleStore = ScheduleStore.Instance;
}
