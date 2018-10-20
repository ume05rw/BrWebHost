/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Events/ViewEvents.ts" />
/// <reference path="../../Util/Dump.ts" />


namespace Fw.Views.Property {
    /**
     * @description 基点、スタッキング時の基準点
     */
    export enum ReferencePoint {
        LeftTop = 1,
        RightTop = 2,
        LeftBottom = 3,
        RightBottom = 4
    }
}