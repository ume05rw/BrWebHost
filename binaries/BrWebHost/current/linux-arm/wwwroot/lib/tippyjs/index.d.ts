/// <reference path="../popperjs/index.d.ts" />

/**
 * 下記を元に、概ねコピペ。
 * https://github.com/atomiks/tippyjs/issues/186
 */
declare namespace Tippy {

    type BasicPlacement = "top" | "bottom" | "left" | "right";

    type Placement =
        | BasicPlacement
        | "top-start" | "top-end" | "bottom-start" | "bottom-end"
        | "left-start" | "left-end" | "right-start" | "right-end";

    type Content = string | Element;

    type Selector = string | Element | NodeList | Popper.ReferenceObject;

    interface Options {
        a11y?: boolean;
        allowHTML?: boolean;
        animateFill?: boolean;
        animation?: "fade" | "scale" | "shift-toward" | "perspective" | "shift-away";
        appendTo?: Element | ((ref: Element) => Element);
        arrow?: boolean;
        arrowType?: "sharp" | "round";
        arrowTransform?: string;
        content?: Content;
        delay?: number | [number, number];
        duration?: number | [number, number];
        distance?: number;
        flip?: boolean;
        flipBehavior?: "flip" | Placement[];
        followCursor?: boolean | "vertical" | "horizontal";
        hideOnClick?: boolean | "toggle";
        inertia?: boolean;
        interactive?: boolean;
        interactiveBorder?: number;
        interactiveDebounce?: number;
        lazy?: boolean;
        livePlacement?: boolean;
        multiple?: boolean;
        offset?: number | string;
        onHidden?(instance: Instance): void;
        onHide?(instance: Instance): void;
        onShow?(instance: Instance): void;
        onShown?(instance: Instance): void;
        performance?: boolean;
        placement?: "top" | "bottom" | "left" | "right";
        popperOptions?: Popper.PopperOptions;
        shouldPopperHideOnBlur?: (event: FocusEvent) => boolean;
        showOnInit?: boolean;
        size?: "small" | "regular" | "large";
        sticky?: boolean;
        target?: string;
        theme?: string;
        touch?: boolean;
        touchHold?: boolean;
        trigger?: "mouseenter" | "focus" | "click" | "manual";
        updateDuration?: number;
        wait?(instance: Instance, event: Event): void;
        zIndex?: number;
    }

    interface Instance {
        clearDelayTimeouts(): void;
        destroy(): void;
        disable(): void;
        enable(): void;
        hide(duration?: number): void;
        id: number;
        popper: Element;
        popperChildren: {
            arrow: Element | null;
            backdrop: Element | null;
            content: Element | null;
            tooltip: Element | null;
        };
        popperInstance: Popper | null;
        props: Options;
        reference: Element;
        set(options: Options): void;
        setContent(content: Content): void;
        show(duration?: number): void;
        state: {
            isEnabled: boolean;
            isVisible: boolean;
            isDestroyed: boolean;
        };
    }

    interface Collection {
        destroyAll(): void;
        instances: Instance[];
        props: Options;
        targets: Selector | Selector[];
    }

    interface Tippy {
        (selector: Selector, options?: Options): Collection;
        readonly defaults: Options;
        readonly version: string;
        disableAnimations(): void;
        hideAllPoppers(): void;
        one(selector: Selector, options?: Options): Instance;
        setDefaults(options: Options): void;
        useCapture(): void;
    }
}
/**
 * globalに 'tippy'という名前の Tippy.Tippyオブジェクトが存在する、という宣言。
 */
declare const tippy: Tippy.Tippy;

/**
 * こちらの定義では、globalにtippy(...)というメソッドが存在する、という定義になってしまう。
 */
//declare function tippy(selector: Tippy.Selector, options?: Partial<Tippy.Options>): Tippy.Object;

