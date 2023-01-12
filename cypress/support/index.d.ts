declare module Cypress {
    interface Chainable {
        getByDataCy<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataCyAdv<E extends Node = HTMLElement>(selector: string, moreSelectors: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        getByData<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataAdv<E extends Node = HTMLElement>(dataName: string, selector: string, moreSelectors: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        promise<T>(promise: Promise<T>): Chainable<T>;

        waitForUrlToChange(currentUrl: string, timeout: number): Chainable<string>;

        scrollTo(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

        getByAriaDescribedBy<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAriaControls<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAriaCurrent<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        getByAriaLabel<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByTitle<E extends Node = HTMLElement>(title: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAlt<E extends Node = HTMLElement>(alt: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByPlaceholder<E extends Node = HTMLElement>(placeholder: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByValue<E extends Node = HTMLElement>(value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByClass<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByRole<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByName<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        waitAndClick(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        getByText(selector: string, timeout: number): Chainable<any>;
        getByExactText(selector: string, timeout: number): Chainable<any>;
        clearAndType(selector: string, text: string, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        waitForClearAndType(selector: string, text: string, timeout: number, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

        getCount(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<number>;

        clearSessionAndCookies(): Chainable<Cypress.AUTWindow>;
        goBack(): Chainable<Cypress.AUTWindow>;
        goForward(): Chainable<Cypress.AUTWindow>;
        navigateTo(route: string): Chainable<Cypress.AUTWindow>;

        assertElementsCount(selector: string, count: number, lengthComparison: "equal" | "above" | "below" | "atMost" | "atLeast", options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

        getInputValue(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<string | number | string[] | undefined>;

        getParent<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getSibling<E extends Node = HTMLElement>(selector: string, nth: number, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getNthChild<E extends Node = HTMLElement>(selector: string, nth: number, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getFirst(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        getLast<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getFirstNth<E extends Node = HTMLElement>(selector: string, nth: number, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getLastNth<E extends Node = HTMLElement>(selector: string, nth: number, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        focus(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

        checkCheckbox(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        uncheckCheckbox(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        clickButton(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        clickLink(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        getByHref<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        waitForNotExistDataCy(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForNotExist(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForExistDataCy(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForExist(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForInvisibleDataCy(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForInvisible(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForVisibleDataCy(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForVisible(selector: string, timeout: number): Chainable<JQuery<HTMLElement>>;
        waitForElement<E extends Node = HTMLElement>(selector: string, timeout: number): Chainable<JQuery<E>>;
        waitForElementDataCy<E extends Node = HTMLElement>(selector: string, timeout: number): Chainable<JQuery<E>>;
        waitForElementDataCyAdv<E extends Node = HTMLElement>(selector: string, moreSelectors: string, timeout: number): Chainable<JQuery<E>>;

        selectFromDropdown(selector: string, value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        hover(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;


    }
}