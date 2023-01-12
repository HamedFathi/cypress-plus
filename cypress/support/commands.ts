/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("getByDataCy", (selector: string, options?: any) => {
    return cy.get(`[data-cy="${selector}"]`, options);
});

Cypress.Commands.add("getByData", (dataName: string, selector: string, options?: any) => {
    return cy.get(`[data-${dataName}="${selector}"]`, options);
});

Cypress.Commands.add("getByDataAdv", (dataName: string, selector: string, moreSelectors: string, options?: any) => {
    moreSelectors = moreSelectors ?? "";
    return cy.get(`[data-${dataName}="${selector}"] ${moreSelectors}`.trim(), options);
});

Cypress.Commands.add("getByDataCyAdv", (selector: string, moreSelectors: string, options?: any) => {
    moreSelectors = moreSelectors ?? "";
    return cy.get(`[data-cy="${selector}"] ${moreSelectors}`.trim(), options);
});

Cypress.Commands.add("promise", <T>(promise: Promise<T>) => {
    return cy.then(() => promise);
});

Cypress.Commands.add("waitForUrlToChange", (currentUrl: string, timeout: number) => {
    if (timeout <= 0)
        timeout = 0;
    cy.wait(timeout);
    return cy.url().should("not.eq", currentUrl);
});

Cypress.Commands.add("scrollTo", (selector: string, options?: any) => {
    return cy.get(selector, options).scrollIntoView();
});
Cypress.Commands.add("assertElementsCount", (selector: string, count: number, lengthComparison: "equal" | "above" | "below" | "atMost" | "atLeast", options?: any) => {
    if (count <= 0)
        count = 0;
    switch (lengthComparison) {
        case "equal":
            return cy.get(selector, options).should('have.length', count);
        case "above":
            return cy.get(selector, options).should('have.length.above', count);
        case "below":
            return cy.get(selector, options).should('have.length.below', count);
        case "atLeast":
            return cy.get(selector, options).should('have.length.at.least', count);
        case "atMost":
            return cy.get(selector, options).should('have.length.at.most', count);
    }
});
Cypress.Commands.add("getCount", (selector: string, options?: any) => {
    return cy.get(selector, options).then($elements => {
        let countOfElements = $elements.length;
        return cy.wrap(countOfElements);
    });
});

Cypress.Commands.add("getByAriaLabel", (ariaLabel: string, options?: any) => {
    return cy.get(`[aria-label="${ariaLabel}"]`, options);
});

Cypress.Commands.add("getByTitle", (title: string, options?: any) => {
    return cy.get(`[title="${title}"]`, options);
});

Cypress.Commands.add("getByAlt", (alt: string, options?: any) => {
    return cy.get(`[alt="${alt}"]`, options);
});

Cypress.Commands.add("getByPlaceholder", (placeholder: string, options?: any) => {
    return cy.get(`[placeholder="${placeholder}"]`, options);
});

Cypress.Commands.add("getByValue", (value: string, options?: any) => {
    return cy.get(`[value="${value}"]`, options);
});

Cypress.Commands.add("waitAndClick", (selector: string, timeout: number) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).click();
});

Cypress.Commands.add("getByText", (text: string, timeout: number) => {
    return cy.contains(text, { matchCase: false, includeShadowDom: true, timeout: timeout });
});

Cypress.Commands.add("getByExactText", (text: string, timeout: number) => {
    return cy.contains(text, { matchCase: true, includeShadowDom: true, timeout: timeout });
});

Cypress.Commands.add("clearAndType", (selector: string, text: string, pressEnter: boolean = false, options?: any) => {
    if (pressEnter)
        return cy.get(selector, options).clear().type(text + '{enter}')
    return cy.get(selector, options).clear().type(text);
});
Cypress.Commands.add("waitForClearAndType", (selector: string, text: string, timeout: number, pressEnter: boolean = false, options?: any) => {
    if (timeout <= 0)
        timeout = 0;
    cy.wait(timeout);
    if (pressEnter)
        return cy.get(selector, options).clear().type(text + '{enter}')
    return cy.get(selector, options).clear().type(text);
});
Cypress.Commands.add("selectFromDropdown", (selector: string, value: string, options?: any) => {
    return cy.get(selector, options).select(value);
});

Cypress.Commands.add("hover", (selector: string, options?: any) => {
    return cy.get(selector, options).trigger("mouseover");
});
Cypress.Commands.add("waitForElement", (selector: string, timeout: number) => {
    return cy.get(selector, { timeout: timeout });
});
Cypress.Commands.add("waitForElementDataCy", (selector: string, timeout: number) => {
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout });
});
Cypress.Commands.add("waitForElementDataCyAdv", (selector: string, moreSelectors: string, timeout: number) => {
    moreSelectors = moreSelectors ?? "";
    return cy.get(`[data-cy="${selector}"] ${moreSelectors}`.trim(), { timeout: timeout });
});

Cypress.Commands.add("getInputValue", (selector: string, options?: any) => {
    return cy.get(selector, options).then(($input) => {
        return cy.wrap($input.val());
    });
});
Cypress.Commands.add("getParent", (selector: string, options?: any) => {
    return cy.get(selector, options).parent();
});

Cypress.Commands.add("getSibling", (selector: string, nth: number, options?: any) => {
    return cy.get(selector, options).siblings(':nth-child(' + nth + ')');
});
Cypress.Commands.add("getNthChild", (selector: string, nth: number, options?: any) => {
    return cy.get(selector, options).children().eq(nth);
});
Cypress.Commands.add("checkCheckbox", (selector: string, options?: any) => {
    return cy.get(selector, options).check();
});
Cypress.Commands.add("uncheckCheckbox", (selector: string, options?: any) => {
    return cy.get(selector, options).uncheck();
});
Cypress.Commands.add("getByClass", (className: string, options?: any) => {
    return cy.get(`.${className}`, options);
});
Cypress.Commands.add("clickButton", (buttonText: string, options?: any) => {
    return cy.get(`button:contains("${buttonText}")`, options).click();
});
Cypress.Commands.add("clickLink", (linkText: string, options?: any) => {
    return cy.get(`link:contains("${linkText}")`, options).click();
});
Cypress.Commands.add("getByRole", (role: string, options?: any) => {
    return cy.get(`[role=${role}]`, options);
});
Cypress.Commands.add("getByName", (name: string, options?: any) => {
    return cy.get(`[name=${name}]`, options);
});
Cypress.Commands.add("getByHref", (href: string, options?: any) => {
    return cy.get(`a[href='${href}']`, options);
});
Cypress.Commands.add("getFirst", (selector: string, options?: any) => {
    return cy.get(selector, options).first();
});
Cypress.Commands.add("getLast", (selector: string, options?: any) => {
    return cy.get(selector, options).last();
});
Cypress.Commands.add("getFirstNth", (selector: string, nth: number, options?: any) => {
    return cy.get(selector, options).first().nextAll().eq(nth);
});
Cypress.Commands.add("getLastNth", (selector: string, nth: number, options?: any) => {
    return cy.get(selector, options).last().prevAll().eq(nth);
});
Cypress.Commands.add("focus", (selector: string, options?: any) => {
    return cy.get(selector, options).focus();
});
Cypress.Commands.add("getByAriaDescribedBy", (ariaDescribedBy: string, options?: any) => {
    return cy.get(`[aria-describedby='${ariaDescribedBy}']`, options);
});
Cypress.Commands.add("getByAriaControls", (ariaControls: string, options?: any) => {
    return cy.get(`[aria-controls='${ariaControls}']`, options);
});
Cypress.Commands.add("getByAriaCurrent", (ariaCurrent: string, options?: any) => {
    return cy.get(`[aria-current='${ariaCurrent}']`, options);
});

Cypress.Commands.add("waitForInvisible", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('not.be.visible');
});
Cypress.Commands.add("waitForVisible", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('be.visible');
});
Cypress.Commands.add("waitForInvisibleDataCy", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout }).should('not.be.visible');
});
Cypress.Commands.add("waitForVisibleDataCy", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout }).should('be.visible');
});

Cypress.Commands.add("waitForExist", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('exist');
});
Cypress.Commands.add("waitForNotExist", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('not.exist');
});
Cypress.Commands.add("waitForExistDataCy", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout }).should('exist');
});
Cypress.Commands.add("waitForNotExistDataCy", (selector: string, timeout) => {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout }).should('not.exist');
});

Cypress.Commands.add("navigateTo", (route: string) => {
    return cy.visit(route);
});
Cypress.Commands.add("goBack", () => {
    return cy.go("back");
});
Cypress.Commands.add("goForward", () => {
    return cy.go("forward");
});

Cypress.Commands.add("clearSessionAndCookies", () => {
    return cy.window().then((win) => {
        win.sessionStorage.clear();
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});