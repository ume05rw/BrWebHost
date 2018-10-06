/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../../Fw/Views/IView.ts" />

namespace Fw.Views.Animation {
    export class Params {
        public static GetCurrent(view: Fw.Views.IView): Params {
            const result = new Params();
            result.X = 0;
            result.Y = 0;
            result.Width = view.Elem.width();
            result.Height = view.Elem.height();
            result.Opacity = Number(view.Elem.get(0).style.opacity);
            return result;
        }

        public static GetResized(view: Fw.Views.IView, resizeRate: number): Params {
            const result = new Params();
            result.X = 0;
            result.Y = 0;
            result.Width = (view.Elem.width() * resizeRate);
            result.Height = (view.Elem.height() * resizeRate);
            result.Opacity = 0.0;
            return result;
        }

        public static GetSlided(view: Fw.Views.IView, xRate: number = 0, yRate: number = 0): Params {
            const result = new Params();
            const width = view.Elem.width();
            const height = view.Elem.height();
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