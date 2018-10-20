/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../IObject.ts" />
/// <reference path="IEntity.ts" />

namespace Fw.Models {
    export interface IStore<T extends IEntity> extends Fw.IObject {
        /**
         * DB上に登録されたEntityのみを保持する、ID連想配列
         */
        readonly List: { [id: number]: T };

        Write(entity: T): void;

        /**
         * 複数一括登録、欲しくなったら追加する。
         */
        //WriteRange(entities: Array<T>): void;
    }
}