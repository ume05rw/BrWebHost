/// <reference path="../lib/jquery/index.d.ts" />
/// <reference path="../lib/underscore/index.d.ts" />

class Page {
    public Id: string;
    public IsDefaultPage: boolean;
    public Elem: JQuery;

    constructor(elem: JQuery) {
        this.Elem = elem;
        this.Id = this.Elem.data("pageid");
        this.IsDefaultPage = (this.Elem.data("pagedefault") == "true");

        if (this.IsDefaultPage)
            this.Elem.show();
    };
};