/// <reference path="../../lib/jquery/index.d.ts" />
/// <reference path="../../lib/underscore/index.d.ts" />

namespace Fw {
    export interface IObject {
        /**
         * クラス名称
         */
        readonly ClassName: string;

        /**
         * 一意のクラスインスタンスID
         */
        readonly InstanceId: string;

        /**
         * 破棄されたか否か
         */
        readonly IsDisposed: boolean;

        /**
         * インスタンスを破棄する。
         */
        Dispose(): void;
    }
}
