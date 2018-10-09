/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/App.ts" />
/// <reference path="../Events/ViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="ViewBase.ts" />


namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.ViewEvents;
    import App = Fw.Util.App;
    import Config = Fw.Config;

    export class PageView extends ViewBase {

        private _id: string;
        public get Id(): string {
            return this._id;
        }

        constructor(jqueryElem: JQuery) {
            super(jqueryElem);
        }

        protected Init(): void {
            super.Init();

            this.SetClassName('PageView');

            if (this.Dom) {
                this._id = this.Elem.data('');
            } else {
                this._id = App.CreateId();
                const elem = $(`<div class="IController" ${Config.PageIdAttribute}="${this._id}"></div>`);
                Fw.Root.Instance.Elem.append(elem);
                this.SetElem(elem);
            }

            this.Elem.addClass(this.ClassName);
        }

        public Show(duration: number = 200): void {
            //Dump.Log(`PageView.Show: ${this.Elem.data('controller')}`);
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
            //Dump.Log(`PageView.Hide: ${this.Elem.data('controller')}`);
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

        public Dispose(): void {
            super.Dispose();

            this._id = null;
        }
    }
}