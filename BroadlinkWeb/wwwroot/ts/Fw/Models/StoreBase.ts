/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../ObjectBase.ts" />
/// <reference path="IStore.ts" />
/// <reference path="IEntity.ts" />

namespace Fw.Models {
    import IEntity = Fw.Models.IEntity;

    export abstract class StoreBase<T extends IEntity> extends Fw.ObjectBase implements IStore<T> {

        private _list: { [id: number]: T } = { };
        public get List(): { [id: number]: T } {
            return this._list;
        }

        /**
         * Storeは基本的にSingletonであるべき、の方向で。
         */
        protected constructor() {
            super();
        }

        /**
         * API応答などのオブジェクトをStoreに入れる。
         * @param entity
         */
        protected Merge(entity: T): void {
            if (entity.Id === null || entity.Id === undefined)
                throw new Error('Entity on Store requires DB-Registed Id.');

            if (this._list[entity.Id]) {
                // 既存Entityのとき

                // API応答はJSONから生成されたオブジェクトで、IEntityコンストラクタを通っていない。
                // 既存要素はIEntity機能の保持が保障されているため、既存要素の値を更新して保持し続ける。
                const obj = this._list[entity.Id];
                let changed = false;
                _.each(entity as any, (val, key) => {
                    if (typeof val === 'function')
                        return;

                    if (obj[key] && obj[key] !== val) {
                        obj[key] = val;
                        changed = true;
                    }
                });

                if (changed)
                    obj.DispatchChanged();

            } else {
                // 新規Entityのとき
                // API応答はJSONから生成されたオブジェクトで、IEntityコンストラクタを通っていない。
                // IEntity機能を持たせた状態でStoreに保持するため、新規生成したインスタンスに値をコピーする。
                const obj = this.GetNewEntity();
                _.extend(obj, entity);
                this._list[obj.Id] = obj;
            }
        }

        protected MergeRange(entities: Array<T>): void {
            for (let i = 0; i < entities.length; i++)
                this.Merge(entities[i]);
        }

        abstract Write(entity: T): void;

        /**
         * 新規IEntityインスタンスを取得する。※new T(); が出来ないので。
         */
        protected abstract GetNewEntity(): T;
    }
}