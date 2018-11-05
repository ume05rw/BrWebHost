/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />
/// <reference path="../Config.ts" />
/// <reference path="../Util/Dump.ts" />
/// <reference path="../Util/App.ts" />
/// <reference path="../Events/PageViewEvents.ts" />
/// <reference path="Animation/Animator.ts" />
/// <reference path="Animation/Params.ts" />
/// <reference path="Property/Size.ts" />
/// <reference path="ViewBase.ts" />


namespace Fw.Views {
    import Dump = Fw.Util.Dump;
    import Anim = Fw.Views.Animation;
    import Events = Fw.Events.PageViewEvents;
    import App = Fw.Util.App;
    import Config = Fw.Config;

    export class PageView extends ViewBase {

        private static ModalWidth: number = 300;

        private _isMasked: boolean = false;
        public get IsMasked(): boolean {
            return this._isMasked;
        }

        private _isModal: boolean = false;
        public get IsModal(): boolean {
            return this._isModal;
        }

        constructor() {
            super($(`<div class="IController IView TransAnimation"></div>`));
            Fw.Root.Instance.Elem.append(this.Elem);
            Fw.Root.Instance.StartPageInitialize();

            this._isMasked = false;

            this.SetClassName('PageView');
            this.Elem.addClass(this.ClassName);

            this.Size.Width = Fw.Root.Instance.Size.Width;
            this.Size.Height = Fw.Root.Instance.Size.Height;
            this.IsVisible = false;

            ////デバッグ用
            //this.EnableLog = true;

            // ブラウザのリサイズ時、ページ全体を再描画
            Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.Resized, () => {
                this.Log(`Root.Resized`);
                this.SetSize(Fw.Root.Instance.Size.Width, Fw.Root.Instance.Size.Height);
            });

            // マスクをクリックしたとき、戻る。
            Fw.Root.Instance.AddEventListener(Fw.Events.RootEvents.MaskClicked, () => {

                //TODO: 自分がモーダル表示されているとき、引っ込む。
                if (this.IsVisible && this._isModal)
                    this.HideModal();

                if (this._isMasked)
                    this.UnMask();
            });
        }

// #region "Animations"

        public Show(duration: number = 200): void {
            this.Log('PageView.Show');
            if (this.IsVisible && !this.IsModal) {
                this.ZIndex = 0;
                this.SetStyle('zIndex', '0');
                this.Dom.style.zIndex = '0';
                this.Refresh();
                return;
            }

            this.ZIndex = 0;
            this.SetStyle('zIndex', '0');
            this.Dom.style.zIndex = '0';

            if (duration <= 0) {
                this.IsVisible = true;
                this.DispatchEvent(Events.Shown);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetSlided(this, -1, 0);
                animator.FromParams.Opacity = 0.5;
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = () => {
                    this.IsVisible = true;
                    this._isModal = false;
                    _.delay(() => {
                        this.Refresh();
                    }, 50);
                    this.DispatchEvent(Events.Shown);
                };
                animator.Invoke(duration);
            }
        }

        public Hide(duration: number = 200): void {
            this.Log('PageView.Hide');
            if (!this.IsVisible && !this.IsModal) {
                this.ZIndex = 0;
                this.SetStyle('zIndex', '0');
                this.Dom.style.zIndex = '0';
                this.Refresh();
                return;
            }

            this.ZIndex = 0;
            this.SetStyle('zIndex', '0');
            this.Dom.style.zIndex = '0';

            if (duration <= 0) {
                this.IsVisible = false;
                this.DispatchEvent(Events.Hidden);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetSlided(this, -1, 0);
                animator.ToParams.Opacity = 0.5;
                animator.OnComplete = () => {
                    this.IsVisible = false;
                    this._isModal = false;
                    this.Refresh();
                    this.DispatchEvent(Events.Hidden);
                };

                animator.Invoke(duration);
            }
        }

        public ShowModal(duration: number = 200): void {

            this.Log('PageView.ShowModal');
            if (this.IsVisible && this._isModal) {
                this.ZIndex = 1;
                this.SetStyle('zIndex', '1');
                this.Dom.style.zIndex = '1';
                this.Refresh();
                return;
            }

            this.ZIndex = 1;
            this.SetStyle('zIndex', '1');
            this.Dom.style.zIndex = '1';

            if (duration <= 0) {
                this.IsVisible = true;
                this.DispatchEvent(Events.Shown);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetSlided(this, 1, 0);
                animator.FromParams.Opacity = 0.5;
                animator.ToParams = Anim.Params.GetCurrent(this);
                animator.ToParams.Opacity = 1.0;
                animator.ToParams.X = animator.ToParams.Width - PageView.ModalWidth;

                animator.OnComplete = () => {
                    this.IsVisible = true;
                    this._isModal = true;
                    this.Position.X = animator.ToParams.X;
                    _.delay(() => {
                        this.Refresh();
                    }, 50);
                    this.DispatchEvent(Events.Shown);
                };
                animator.Invoke(duration);
            }
        }

        public HideModal(duration: number = 200): void {
            this.Log('PageView.HideModal');
            if (!this.IsVisible) {
                this.ZIndex = 0;
                this.SetStyle('zIndex', '0');
                this.Dom.style.zIndex = '0';
                this.Refresh();
                return;
            }

            if (duration <= 0) {
                this.IsVisible = false;
                this.DispatchEvent(Events.Hidden);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetSlided(this, 1, 0);
                animator.ToParams.X = this.Size.Width - this.Position.X;
                animator.ToParams.Opacity = 0.5;
                animator.OnComplete = () => {
                    this.ZIndex = 0;
                    this.SetStyle('zIndex', '0');
                    this.Dom.style.zIndex = '0';

                    this.IsVisible = false;
                    this._isModal = false;
                    this.SetLeftTop(0, 0);
                    //this.Position.X = 0;
                    //this.Position.Y = 0;
                    this.Refresh();
                    this.DispatchEvent(Events.Hidden);
                };

                animator.Invoke(duration);
            }
        }

        public SetUnmodal(duration: number = 200): void {
            //this.Log(`PageView.SetUnmodal: ${this.Elem.data('controller')}`);
            if (this.IsVisible && !this._isModal) {
                this.ZIndex = 0;
                this.SetStyle('zIndex', '0');
                this.Dom.style.zIndex = '0';
                this.Refresh();
                return;
            }

            if (duration <= 0) {
                this.IsVisible = false;
                this.DispatchEvent(Events.Hidden);
            } else {
                const animator = new Anim.Animator(this);
                animator.FromParams = Anim.Params.GetCurrent(this);
                animator.FromParams.Opacity = 1.0;
                animator.ToParams = Anim.Params.GetSlided(this, 0, 0);
                animator.ToParams.X = - this.Position.X;
                animator.ToParams.Opacity = 1.0;
                animator.OnComplete = () => {
                    this.ZIndex = 0;
                    this.SetStyle('zIndex', '0');
                    this.Dom.style.zIndex = '0';

                    this.IsVisible = true;
                    this._isModal = false;
                    this.SetLeftTop(0, 0);
                    //this.Position.X = 0;
                    //this.Position.Y = 0;
                    this.Refresh();
                    this.DispatchEvent(Events.Hidden);
                };

                animator.Invoke(duration);
            }
        }

// #endregion

        public Mask(): void {
            //this.Log(`${this.ClassName}.Mask`);
            this._isMasked = true;
            Fw.Root.Instance.Mask();
            this.ZIndex = -1;
            this.Dom.style.zIndex = '-1';
            this.SetStyle('zIndex', '-1');
            this.Refresh();
        }

        public UnMask(): void {
            //this.Log(`${this.ClassName}.UnMask`);
            this._isMasked = false;
            Fw.Root.Instance.UnMask();
            this.ZIndex = 0;
            this.Dom.style.zIndex = '0';
            this.SetStyle('zIndex', '0');
            this.Refresh();
        }

        public Refresh(): void {
            //this.Log('PageView.Refresh');
            super.Refresh();

            if (this.IsSuppressLayout || !this.IsInitialized)
                return;

            // jQueryのイベントバブリングに注意。
            // Domツリーが構成された後では、Fw上で追加したコントロールの全て、
            // ツリーの上位に向かってイベントが伝播していく。
            // AddEventListenerでバインドしたラムダの先頭行には、常に event.stopPropagation() を
            // 最初に書くように。

            // ページリフレッシュ時は、子Viewをリフレッシュ指示する。
            _.each(this.Children, (v: IView) => {
                v.Refresh();
            });
        }

        protected InnerRefresh(): void {
            //this.Log('PageView.InnerRefresh');

            try {
                this.SuppressLayout();

                //const pHalfWidth = Root.Instance.Size.Width / 2;
                //const pHalfHeight = Root.Instance.Size.Height / 2;
                //const myHalfWidth = Root.Instance.Size.Width / 2;
                //const myHalfHeight = Root.Instance.Size.Height / 2;
                //let elemLeft = pHalfWidth - myHalfWidth + this.Position.X;
                //let elemTop = pHalfHeight - myHalfHeight + this.Position.Y;

                if (this.IsVisible && this.IsModal) {
                    const left = Root.Instance.Size.Width - PageView.ModalWidth;
                    if (this.Position.X !== left)
                        this.Position.X = left;
                }

                this.SetStyles({
                    left: `${this.Position.X}px`,
                    top: `${this.Position.Y}px`,
                    width: `100%`,
                    height: `100%`,
                    zIndex: `${this.ZIndex}`,
                    color: `${this.Color}`,
                    backgroundColor: `${this.BackgroundColor}`,
                    display: (this.IsVisible) ? 'block' : 'none'
                });
                _.defer(() => {
                    this.ApplyStyles();
                });

            } catch (e) {
                Dump.ErrorLog(e, this.ClassName);
            } finally {
                this.ResumeLayout();
            }
        }

        public Dispose(): void {
            super.Dispose();
        }
    }
}
