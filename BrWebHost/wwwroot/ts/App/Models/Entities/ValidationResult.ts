/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/ValidationFailType.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import ValidationFailType = App.Items.ValidationFailType;

    export class ValidationResult extends Fw.Models.EntityBase {
        public Entity: ControlSet | Control | Scene | SceneDetail | Schedule;
        public Name: string;
        public Message: string;
        public Type: ValidationFailType;

        constructor(
            entity: ControlSet | Control | Scene | SceneDetail | Schedule,
            name: string = null,
            message: string = null,
            type: ValidationFailType = ValidationFailType.Error,
        ) {
            super();
            this.Entity = entity;

            if (name)
                this.Name = name;

            if (message)
                this.Message = message;

            if (type)
                this.Type = type;
        }
    }
}
