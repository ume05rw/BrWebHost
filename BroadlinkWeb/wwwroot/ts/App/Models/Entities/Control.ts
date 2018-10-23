/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Models/EntityBase.ts" />
/// <reference path="../../../Fw/Util/Dump.ts" />
/// <reference path="../../Items/Color.ts" />

namespace App.Models.Entities {
    import Dump = Fw.Util.Dump;
    import Color = App.Items.Color;

    export class Control extends Fw.Models.EntityBase {
        public ControlSetId: number;
        public Name: string = '';
        public PositionLeft: number = 0;
        public PositionTop: number = 0;
        
        
        public IconUrl: string = '';
        public Code: string = '';
        public IsAssignToggleOn: boolean = false;
        public IsAssignToggleOff: boolean = false;

        private _color: string = Color.ButtonColors[0];
        public get Color(): string {
            return this._color;
        }
        public set Color(value: string) {
            if (this._color !== value) {
                this._color = value;
                this._hoverColor = Color.GetButtonHoverColor(this._color);
            }
        }

        private _hoverColor: string = Color.ButtonHoverColors[0];
        public get HoverColor(): string {
            return this._hoverColor;
        }
    }
}
