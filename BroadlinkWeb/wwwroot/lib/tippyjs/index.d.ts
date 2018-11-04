/// <reference path="../popperjs/index.d.ts" />

declare namespace Tippy {
    //import Popper from "../popperjs/popper.js";

    type BasicPlacement = "top" | "bottom" | "left" | "right";

    type Placement =
        | BasicPlacement
        | "top-start" | "top-end" | "bottom-start" | "bottom-end"
        | "left-start" | "left-end" | "right-start" | "right-end";

    type Content = string | Element;

    type Selector = string | Element | NodeList; // | Popper.ReferenceObject;

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
        //placement?: ExtendedPlacement;
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
        //popperInstance: Popper.Popper | null;
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

    //interface Object {
    //    /** The target references to be given tooltips. */
    //    selector: Selector | Selector[];
    //    /** Array of all Tippy instances that were created. */
    //    tooltips: Instance[];
    //    /** Default + instance options merged. */
    //    options: Options;
    //    /** Method to destroy all tooltips that were created (all Tippy instances inside `tooltips`) */
    //    destroyAll: () => void;
    //}

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

    const tippy: Tippy;
    //export default tippy;
}

declare function tippy(selector: Tippy.Selector, options?: Partial<Tippy.Options>): Tippy.Instance;
