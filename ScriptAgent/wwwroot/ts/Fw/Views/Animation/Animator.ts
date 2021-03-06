﻿/// <reference path="../../../../lib/jquery/index.d.ts" />
/// <reference path="../../../../lib/underscore/index.d.ts" />
/// <reference path="../../Util/Dump.ts" />
/// <reference path="Params.ts" />
/*/// <reference path="../IView.ts" /> */

namespace Fw.Views.Animation {
    import Dump = Fw.Util.Dump;

    export class Animator {
        private _view: Fw.Views.IView;

        public FromParams: Params = null;
        public ToParams: Params = null;

        public OnComplete: Function = null;

        constructor(view: Fw.Views.IView, toParams?: Params) {
            this._view = view;
            this.FromParams = Animation.Params.GetCurrent(view);
            this.ToParams = (toParams)
                ? toParams
                : Animation.Params.GetCurrent(view);
        }

        public Invoke(duration: number = 200): void {
            if (!duration)
                duration = 200;

            if (!this.FromParams)
                this.FromParams = Params.GetCurrent(this._view);

            const parent = $(this._view.Elem.parent());

            const parentWidth = (this._view.Parent)
                ? this._view.Parent.Size.Width
                : parent.width();
            const parentHeight = (this._view.Parent)
                ? this._view.Parent.Size.Height
                : parent.height();


            const pHalfWidth = (parentWidth / 2);
            const pHalfHeight = (parentHeight / 2);
            const dom = this._view.Elem.get(0) as HTMLElement;

            const fromX = this._view.Position.X + this.FromParams.X;
            const fromY = this._view.Position.Y + this.FromParams.Y;
            const fromLeft = pHalfWidth + fromX - (this.FromParams.Width / 2);
            const fromTop = pHalfHeight + fromY - (this.FromParams.Height / 2);

            const toX = this._view.Position.X + this.ToParams.X;
            const toY = this._view.Position.Y + this.ToParams.Y;
            const toLeft = pHalfWidth + toX - (this.ToParams.Width / 2);
            const toTop = pHalfHeight + toY - (this.ToParams.Height / 2);

            const hasTransAnimation = this._view.HasTransAnimation();

            //Dump.Log({
            //    name: 'center',
            //    pHalfWidth: pHalfWidth,
            //    pHalfHeight: pHalfHeight,
            //    currentX: this._view.Position.X,
            //    currentY: this._view.Position.Y,
            //});

            //Dump.Log({
            //    name: 'from',
            //    addX: this.FromParams.X,
            //    addY: this.FromParams.Y,
            //    x: fromX,
            //    y: fromY,
            //    left: fromLeft,
            //    top: fromTop,
            //    width: this.FromParams.Width,
            //    height: this.FromParams.Height
            //});

            //Dump.Log({
            //    name: 'to',
            //    addX: this.ToParams.X,
            //    addY: this.ToParams.Y,
            //    x: toX,
            //    y: toY,
            //    left: toLeft,
            //    top: toTop,
            //    width: this.ToParams.Width,
            //    height: this.ToParams.Height
            //});

            // アニメーション開始時点の値をセット
            dom.style.display = `block`;
            dom.style.position = `absolute`;
            dom.style.left = `${fromLeft}px`;
            dom.style.top = `${fromTop}px`;
            dom.style.width = `${this.FromParams.Width}px`;
            dom.style.height = `${this.FromParams.Height}px`;
            dom.style.opacity = `${this.FromParams.Opacity}`;
            if (hasTransAnimation)
                this._view.SetTransAnimation(false);

            // アニメーション終了時点の値をセット
            this._view.Elem.animate(
                {
                    'left': `${toLeft}px`,
                    'top': `${toTop}px`,
                    'width': `${this.ToParams.Width}px`,
                    'height': `${this.ToParams.Height}px`,
                    'opacity': this.ToParams.Opacity
                }, {
                    'duration': duration,
                    'complete': () => {
                        if (hasTransAnimation)
                            this._view.SetTransAnimation(true);

                        if (_.isFunction(this.OnComplete))
                            this.OnComplete();
                    }
                }
            );
        }

        public Dispose(): void {
            this._view = null;
            this.FromParams = null;
            this.ToParams = null;
            this.OnComplete = null;
        }
    }
}
