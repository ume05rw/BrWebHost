/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/StoreBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../../Fw/Util/Xhr/Query.ts" />
/// <reference path="../Entities/Job.ts" />


namespace App.Models.Stores {
    import Dump = Fw.Util.Dump;
    import Xhr = Fw.Util.Xhr;
    import Job = App.Models.Entities.Job;

    export class JobStore extends Fw.Models.StoreBase<Job> {

        private static _instance: JobStore = null;
        public static get Instance(): JobStore {
            if (JobStore._instance === null)
                JobStore._instance = new JobStore();

            return JobStore._instance;
        }

        protected constructor() {
            super();

            this.SetClassName('JobStore');
            //this.EnableLog = true;
        }


        public async Get(id: number): Promise<Job> {

            const params = new Xhr.Params(
                `Jobs/${id}`,
                Xhr.MethodType.Get
            );

            const res = await Xhr.Query.Invoke(params);

            if (res.Succeeded) {

                const obj = this.Merge(res.Values);

                return obj;
            } else {
                this.Log('Query Fail');
                this.Log(res.Errors);
                return null;
            }
        }

        public Write(entity: Job): void {
            throw new Error("Method not implemented.");
        }
        protected GetNewEntity(): Job {
            return new Job();
        }
    }

    export const Jobs: JobStore = JobStore.Instance;
}
