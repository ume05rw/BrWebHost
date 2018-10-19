/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../ObjectBase.ts" />
/// <reference path="IStore.ts" />

namespace Fw.Models.Stores {
    export abstract class StoreBase<T> extends Fw.ObjectBase implements IStore {

        private _list: Array<T> = new Array<T>();
        public get List(): Array<T> {
            return this._list;
        }

    }
}