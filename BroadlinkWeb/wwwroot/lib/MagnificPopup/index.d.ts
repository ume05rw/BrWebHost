//Magnific Popup Definition File

interface JQuery {
    magnificPopup(callback?: () => void): JQuery;
}

interface JQueryStatic {
    magnificPopup: JQueryMagnificPopupStatic;
}

interface JQueryMagnificPopup {
    wrap: JQuery
}

interface JQueryMagnificPopupStatic {
    open(params?: any) : any;
    close() : any;
    (): JQuery;
    instance: JQueryMagnificPopup,
    parameter(name: string): string;
    parameter(name: string, value: string, append?: boolean): JQuery;
}
