declare module Cypress {
    interface Chainable {
        dataCyAdv<E extends Node = HTMLElement>(
            selector: string,
            moreSelectors: string,
            ...args: any
        ): Chainable<JQuery<E>>;
        dataCy<E extends Node = HTMLElement>(selector: string, ...args: any): Chainable<JQuery<E>>;
        promise(promise: Promise<any>): Chainable<any>;
        promiseOfT<T>(promise: Promise<T>): Chainable<T>;
    
    }
}