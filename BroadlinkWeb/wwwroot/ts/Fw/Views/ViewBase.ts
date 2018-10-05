/// <reference path="../../../lib/jquery/index.d.ts" />
/// <reference path="../../../lib/underscore/index.d.ts" />

namespace Fw.Views {
    export abstract class ViewBase implements IView {
        public Elem: JQuery;
        public Children: Array<IView>;

        constructor(jqueryElem: JQuery) {
            this.Children = new Array<IView>();
            this.Elem = jqueryElem;
        }

        public Add(view: IView): void {
            if (this.Children.indexOf(view) != -1) {
                this.Children.push(view);
                this.Elem.append(view.Elem);
            }
        }

        public Remove(view: IView): void {
            const index = this.Children.indexOf(view);
            if (index != -1) {
                this.Children.splice(index, 1);
                view.Elem.detach();
            }
        }

        public Dispose(): void {
            _.each(this.Children, (view) => {
                view.Dispose();
            });
            this.Children = null;

            this.Elem.remove();
            this.Elem = null;
        }
    }
}