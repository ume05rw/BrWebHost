/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../../Items/ControlSetTemplate.ts" />
/// <reference path="../Entities/ControlSet.ts" />
/// <reference path="../Entities/ControlHeader.ts" />
/// <reference path="ControlStore.ts" />


namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import ControlSet = App.Models.Entities.ControlSet;
    import Controls = App.Models.Stores.Controls;
    import Xhr = Fw.Util.Xhr;
    import ControlSetTemplate = App.Items.ControlSetTemplate;
    import ControlHeader = App.Models.Entities.ControlHeader;

    export class ControlSetStore extends Fw.Models.StoreBase<ControlSet> {

        private static _instance: ControlSetStore = null;
        public static get Instance(): ControlSetStore {
            if (ControlSetStore._instance === null)
                ControlSetStore._instance = new ControlSetStore();

            return ControlSetStore._instance;
        }

        protected constructor() {
            super();

            this.SetClassName('ControlSetStore');
            this.EnableLog = true;
        }

        protected GetNewEntity(): ControlSet {
            return new ControlSet();
        }

        public async GetTemplateClone(id: ControlSetTemplate): Promise<ControlSet> {
            if (Object.keys(this.List).length < 6)
                await this.GetList();

            const tpl = this.List[id];
            const result = new ControlSet();
            result.Name = tpl.Name;
            result.IconUrl = tpl.IconUrl;
            result.ToggleState = tpl.ToggleState;
            result.Color = tpl.Color;
            result.Order = tpl.Order;
            result.ToggleState = tpl.ToggleState;
            result.IsMainPanelReady = tpl.IsMainPanelReady;
            result.IsTogglable = tpl.IsTogglable;
            result.OperationType = tpl.OperationType;
            result.IsTemplate = false;

            _.each(tpl.Controls, (ctpl: App.Models.Entities.Control) => {
                const control = new App.Models.Entities.Control();
                control.Name = ctpl.Name;
                control.PositionLeft = ctpl.PositionLeft;
                control.PositionTop = ctpl.PositionTop;
                control.IconUrl = ctpl.IconUrl;
                control.Code = ctpl.Code;
                control.IsAssignToggleOn = ctpl.IsAssignToggleOn;
                control.IsAssignToggleOff = ctpl.IsAssignToggleOff;
                control.Color = ctpl.Color;
                result.Controls.push(control);
            });

            return result;
        }

        public async GetList(): Promise<ControlSet[]> {

            const params = new Xhr.Params(
                'ControlSets',
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                const list = res.Values as ControlSet[];
                _.each(list, (entity: ControlSet) => {
                    const obj = this.Merge(entity);

                    // API応答値を、TS側Entityに整形して保持しておく。
                    if (entity.Controls && entity.Controls.length > 0) {
                        Controls.SetRange(entity.Controls);
                        obj.Controls = Controls.GetListByControlSetId(entity.Id);
                    } else {
                        obj.Controls = [];
                    }
                });

                return _.values(this.List);
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);

                return [];
            }
        }

        public async GetListWithoutTemplates(): Promise<ControlSet[]> {
            await this.GetList();

            let result = new Array<ControlSet>();
            _.each(this.List, (cs: ControlSet) => {
                if (!cs.IsTemplate)
                    result.push(cs);
            });

            result = _.sortBy(result, (cs: ControlSet) => {
                return cs.Order;
            });

            return result;
        }

        public async GetListForMainPanel(): Promise<ControlSet[]> {
            await this.GetList();

            let result = new Array<ControlSet>();
            _.each(this.List, (cs: ControlSet) => {
                if (!cs.IsTemplate && cs.IsMainPanelReady)
                    result.push(cs);
            });

            result = _.sortBy(result, (cs: ControlSet) => {
                return cs.Order;
            });

            return result;
        }


        public async UpdateHeader(entity: ControlSet): Promise<boolean> {

            const header = new ControlHeader();
            header.Id = entity.Id;
            header.Order = entity.Order;
            header.ToggleState = entity.ToggleState;

            const params = new Xhr.Params(
                `ControlSets/UpdateHeader/${header.Id}`,
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

        public async UpdateHeaders(entities: ControlSet[]): Promise<boolean> {

            const headers = new Array<ControlHeader>();

            _.each(entities, (entity: ControlSet) => {
                const header = new ControlHeader();
                header.Id = entity.Id;
                header.Order = entity.Order;
                header.ToggleState = entity.ToggleState;
                headers.push(header);
            });

            const params = new Xhr.Params(
                `ControlSets/UpdateHeader`,
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


        public async Write(entity: ControlSet): Promise<ControlSet> {

            const params = new Xhr.Params(
                'ControlSets',
                Xhr.MethodType.Post,
                entity
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {
                const id = (res.Values as ControlSet).Id;

                this.Merge(res.Values as ControlSet);

                const result = this.List[id];

                // API応答値を、TS側Entityに整形して保持しておく。
                if (res.Values.Controls && res.Values.Controls.length > 0) {
                    Controls.SetRange(res.Values.Controls);
                    result.Controls = Controls.GetListByControlSetId(id);
                } else {
                    result.Controls = [];
                }

                return result;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public async Remove(entity: ControlSet): Promise<boolean> {

            const params = new Xhr.Params(
                `ControlSets/${entity.Id}`,
                Xhr.MethodType.Delete,
                entity
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                _.each(entity.Controls, (c) => {
                    delete Controls.List[c.Id];
                });

                delete this.List[entity.Id];

                return true;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return false;
            }
        }
    }

    export const ControlSets: ControlSetStore = ControlSetStore.Instance;
}
