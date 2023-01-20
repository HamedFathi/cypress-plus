declare module Cypress {
    interface Chainable<Subject = any> {

        getByDataCyContains<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataCyStartsWith<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataCyEndsWith<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        getByDataCy<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataCyAdv<E extends Node = HTMLElement>(selector: string, moreSelectors: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        getByDataContains<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataStartsWith<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataEndsWith<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        getByData<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByDataAdv<E extends Node = HTMLElement>(dataName: string, selector: string, moreSelectors: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        await<T>(promise: Promise<T>): Chainable<T>;

        waitForUrlToChange(currentUrl: string, timeout: number): Chainable<string>;

        getByAriaDescribedBy<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAriaControls<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAriaCurrent<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        getByAriaLabel<E extends Node = HTMLElement>(ariaLabel: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByTitle<E extends Node = HTMLElement>(title: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAlt<E extends Node = HTMLElement>(alt: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByPlaceholder<E extends Node = HTMLElement>(placeholder: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByValue<E extends Node = HTMLElement>(value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByClass<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByClassContains<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByClassStartsWith<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByClassEndsWith<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

        getByAttribute<E extends Node = HTMLElement>(attrName: string, attrValue: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAttributeContains<E extends Node = HTMLElement>(attrName: string, attrValue: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAttributeStartsWith<E extends Node = HTMLElement>(attrName: string, attrValue: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
        getByAttributeEndsWith<E extends Node = HTMLElement>(attrName: string, attrValue: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

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

        getAttribute(selector: string, attribute: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<string | undefined>;
        getAttributeDataCy(selector: string, attribute: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<string | undefined>;
        getAttributeDataCyAdv(selector: string, attribute: string, moreSelectors: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<string | undefined>;

        getParentIf(selector: string, condition: (parent: JQuery<HTMLElement>) => boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        getChildIf(selector: string, condition: (child: JQuery<HTMLElement>) => boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        getParentsIf(selector: string, condition: (parent: JQuery<HTMLElement>) => boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>[]>;
        getChildrenIf(selector: string, condition: (child: JQuery<HTMLElement>) => boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>[]>;

        iterateChildren(selector: string, callback: (child: JQuery<HTMLElement>) => void, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
        iterateChildrenIf(selector: string, condition: (child: JQuery<HTMLElement>) => boolean, callback: (child: JQuery<HTMLElement>) => void, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

        polling<ReturnType = any>(
            checkFunction: (subject: Subject | undefined) => ReturnType | Chainable<ReturnType> | Promise<ReturnType>,
            options?: PollingOptions<Subject>,
        ): Chainable<Subject>;
    }
}

type PollingLog = Pick<Cypress.LogConfig, "name" | "message" | "consoleProps">;

type PollingErrorMsgCallback<Subject = any> = (result: Subject, options: PollingOptions<Subject>) => string;

interface PollingOptions<Subject = any> {
    retries?: number;
    timeout?: number;
    interval: number | number[];
    errorMessage?: string | PollingErrorMsgCallback<Subject>;
    description?: string;
    customLogMessage?: string;
    verbose?: boolean;
    customLogCheckMessage?: string;
    logger?: (logOptions: PollingLog) => any;
    log?: boolean;
    mode: 'timeout' | 'retry',
    ignoreTimeoutError?: boolean,
    postFailureAction?: () => void,
}