/// <reference path="../Models/Entities/ControlSet.ts" />

namespace App.Controllers {
    import Entities = App.Models.Entities;

    export interface IControlSetController {
        Select(parentController: Fw.Controllers.IController): Promise<any>;
        SetEditMode(): void;
        SetExecMode(): void;
        SetSelectMode(): void;
        SetEntity(entity: Entities.ControlSet): void;
        GetLearnedCode(): Promise<string>;
        ExecCode(control: Entities.Control): Promise<boolean>;
        ResetToggleAssign(control: Entities.Control, targetState: boolean): void;
        RemoveControl(control: Entities.Control): void;
        RemoveControlSet(): Promise<boolean>;
    }
}
