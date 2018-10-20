/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../IObject.ts" />

namespace Fw.Models {
    export interface IEntity extends Fw.IObject {
        Id: number;

        DispatchChanged(): void;
    }
}