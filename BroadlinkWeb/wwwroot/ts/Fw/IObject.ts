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
         * クラス名-インスタンスIDのセット文字列
         */
        readonly ObjectIdentifier: string;

        /**
         * 破棄されたか否か
         */
        readonly IsDisposed: boolean;

        /**
         * ログ出力可否
         */
        LogEnable: boolean;

        /**
         * ログ出力
         * @param value
         */
        Log(value: any): void;

        /**
         * インスタンスを破棄する。
         */
        Dispose(): void;
    }
}
