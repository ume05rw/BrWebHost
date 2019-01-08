/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />
/*/// <reference path="../IView.ts" />*/

namespace Fw.Views.Animation {
    import Dump = Fw.Util.Dump;

    export class Params {
        public static GetCurrent(view: Fw.Views.IView): Params {
            const result = new Params();
            result.X = 0; // このX,Yは増分を指定するもののため、現時点の座標は X=0, Y= 0
            result.Y = 0;
            result.Width = view.Size.Width;
            result.Height = view.Size.Height;
            result.Opacity = Number(view.Opacity || 1);
            return result;
        }

        public static GetResized(view: Fw.Views.IView, resizeRate: number): Params {
            const result = new Params();
            result.X = 0;
            result.Y = 0;
            result.Width = (view.Size.Width * resizeRate);
            result.Height = (view.Size.Height * resizeRate);
            result.Opacity = 0.0;
            return result;
        }

        public static GetSlided(view: Fw.Views.IView, xRate: number = 0, yRate: number = 0): Params {
            const result = new Params();
            const width = view.Size.Width;
            const height = view.Size.Height;
            result.X = (width * xRate);
            result.Y = (height * yRate);
            result.Width = width;
            result.Height = height;
            result.Opacity = 0.8;
            return result;
        }

        public X: number = 0;
        public Y: number = 0;
        public Width: number = 0;
        public Height: number = 0;
        public Opacity: number = 1;
    }
}