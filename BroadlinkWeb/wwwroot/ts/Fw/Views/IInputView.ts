/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="IView.ts" />
/// <reference path="Property/Anchor.ts" />

namespace Fw.Views {

    export interface IInputView extends IView {
        Value: string;
        Name: string
    }
}