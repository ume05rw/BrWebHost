/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="ViewBase.ts" />


namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ViewEvents;

    export class PageView extends ViewBase {
        constructor(jqueryElem: JQuery) {
            super(jqueryElem);
            this.ClassName = 'PageView';
        }

        public Show(duration: number = 200): void {
            //console.log(`PageView.Show: ${this.Elem.data('controller')}`);
            if (this.IsVisible())
                return;

            const animator = new Anim.Animator(this);
            animator.FromParams = Anim.Params.GetSlided(this, -1, 0);
            animator.FromParams.Opacity = 0.5;
            animator.ToParams = Anim.Params.GetCurrent(this);
            animator.ToParams.Opacity = 1.0;
            animator.OnComplete = () => {
                this.Dom.style.display = `block`;
                this.Refresh();
                this.DispatchEvent(Events.Shown);
            };
            animator.Invoke(duration);
        }

        public Hide(duration: number = 200): void {
            //console.log(`PageView.Hide: ${this.Elem.data('controller')}`);
            if (!this.IsVisible())
                return;

            const animator = new Anim.Animator(this);
            animator.FromParams = Anim.Params.GetCurrent(this);
            animator.FromParams.Opacity = 1.0;
            animator.ToParams = Anim.Params.GetSlided(this, -1, 0);
            animator.ToParams.Opacity = 0.5;
            animator.OnComplete = () => {
                this.Dom.style.display = `none`;
                this.Refresh();
                this.DispatchEvent(Events.Hidden);
            };

            animator.Invoke(duration);
        }

        protected InnerRefresh(): void {
            this.Dom.style.left = `0px`;
            this.Dom.style.top = `0px`;
            this.Dom.style.width = `100%`;
            this.Dom.style.height = `100%`;
        }
    }
}