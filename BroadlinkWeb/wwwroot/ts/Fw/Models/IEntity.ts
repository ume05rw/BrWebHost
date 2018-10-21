/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

/// <reference path="../IEventable.ts" />

namespace Fw.Models {
    export interface IEntity extends IEventable {
        Id: number;

        DispatchChanged(): void;
    }
}
