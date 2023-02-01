/// <reference types="cypress" />

function logCommand({ options, originalOptions }) {
    if (options.log) {
        options.logger({
            name: options.description,
            message: options.customLogMessage,
            consoleProps: () => originalOptions,
        })
    }
}
function logCommandCheck({ result, options, originalOptions }) {
    if (!options.log || !options.verbose)
        return

    const message = [result]
    if (options.customLogCheckMessage) {
        message.unshift(options.customLogCheckMessage)
    }
    options.logger({
        name: options.description,
        message,
        consoleProps: () => originalOptions,
    })
}

function polling(subject: any, checkFunction: any, originalOptions = {}) {
    if (!(checkFunction instanceof Function)) {
        throw new Error("'checkFunction' parameter should be a function. Found: " + checkFunction)
    }
    const defaultOptions = {
        interval: 200,
        timeout: 5000,
        retries: 25,
        errorMessage: <any>"Timed out retrying.",
        description: "polling",
        log: true,
        customLogMessage: undefined,
        logger: Cypress.log,
        verbose: false,
        customLogCheckMessage: undefined,
        postFailureAction: <any>undefined,
        mode: "timeout",
        ignoreTimeoutError: false,
    }
    const options = { ...defaultOptions, ...originalOptions }

    options.customLogMessage = <any>[options.customLogMessage, originalOptions].filter(Boolean)

    let retries = 0
    if (options.mode == "timeout") {
        retries = Math.floor(options.timeout / options.interval)
        options.errorMessage = "Timed out retrying."
    } else {
        retries = options.retries
        options.errorMessage = "Retried too many times."
    }

    let currentWaitTime: number | undefined
    let waitTime: number | number[] = 0
    if (Array.isArray(options.interval)) {
        waitTime = options.interval.reverse()
    } else {
        waitTime = options.interval
    }
    if (Array.isArray(options.interval)) {
        if (options.interval.length > 1) {
            currentWaitTime = (<number[]>waitTime).pop()
        } else {
            currentWaitTime = waitTime[0]
        }
    } else {
        currentWaitTime = <number>waitTime
    }

    logCommand({ options, originalOptions })

    const check = (result: any) => {
        logCommandCheck({ result, options, originalOptions })
        if (Array.isArray(options.interval)) {
            if (options.interval.length > 1) {
                currentWaitTime = (<number[]>waitTime).pop()
            } else {
                currentWaitTime = waitTime[0]
            }
        } else {
            currentWaitTime = <number>waitTime
        }
        if (result) {
            return result
        }
        if (retries < 1) {
            const msg = options.errorMessage instanceof Function ? options.errorMessage(result, options) : options.errorMessage
            if (options.postFailureAction && options.postFailureAction instanceof Function)
                options.postFailureAction()
            if (!options.ignoreTimeoutError)
                throw new Error(msg)
        }
        if (currentWaitTime) {
            cy.wait(currentWaitTime, { log: false }).then(() => {
                retries--
                return resolveValue()
            })
        }
    }

    const resolveValue = () => {
        const result = checkFunction(subject)
        const isAPromise = Boolean(result && result.then)
        if (isAPromise) {
            return result.then(check)
        } else {
            return check(result)
        }
    }

    return resolveValue()
}

Cypress.Commands.add("polling", { prevSubject: "optional" }, polling);

Cypress.Commands.add("clickOnDataCy", (selector: string, options?: any) => {
    return cy.get(`[data-cy="${selector}"]`, options).click(options);
});

Cypress.Commands.add("waitForUrlAndVisibleDataCy", (url: string, selector: string, timeout?: number) => {
    if (url && selector) {
        cy.visit(url as string, { timeout: timeout || 5000 });
        return cy.get(`[data-cy="${selector}"]`, { timeout: timeout || 5000 }).should("be.visible");
    }
});
Cypress.Commands.add("waitForUrlAndVisible", (url: string, selector: string, timeout?: number) => {
    if (url && selector) {
        cy.visit(url as string, { timeout: timeout || 5000 });
        return cy.get(selector, { timeout: timeout || 5000 }).should("be.visible");
    }
});

Cypress.Commands.add("rightClickOnDataCy", (selector: string, options?: any) => {
    return cy.get(`[data-cy="${selector}"]`, options).rightclick(options);
});

Cypress.Commands.add("getByDataCy", (selector: string, options?: any) => {
    return cy.get(`[data-cy="${selector}"]`, options);
});

Cypress.Commands.add("getByDataCyStartsWith", (selector: string, options?: any) => {
    return cy.get(`[data-cy^="${selector}"]`, options);
});

Cypress.Commands.add("getByDataCyEndsWith", (selector: string, options?: any) => {
    return cy.get(`[data-cy$="${selector}"]`, options);
});

Cypress.Commands.add("getByDataCyContains", (selector: string, options?: any) => {
    return cy.get(`[data-cy*="${selector}"]`, options);
});

Cypress.Commands.add("getByData", (dataName: string, selector: string, options?: any) => {
    return cy.get(`[data-${dataName}="${selector}"]`, options);
});

Cypress.Commands.add("getByDataStartsWith", (dataName: string, selector: string, options?: any) => {
    return cy.get(`[data-${dataName}^="${selector}"]`, options);
});

Cypress.Commands.add("getByDataEndsWith", (dataName: string, selector: string, options?: any) => {
    return cy.get(`[data-${dataName}$="${selector}"]`, options);
});

Cypress.Commands.add("getByDataContains", (dataName: string, selector: string, options?: any) => {
    return cy.get(`[data-${dataName}*="${selector}"]`, options);
});

Cypress.Commands.add("getByDataAdv", (dataName: string, selector: string, moreSelectors: string, options?: any) => {
    moreSelectors = moreSelectors ?? "";
    return cy.get(`[data-${dataName}="${selector}"] ${moreSelectors}`.trim(), options);
});

Cypress.Commands.add("getByDataCyAdv", (selector: string, moreSelectors: string, options?: any) => {
    moreSelectors = moreSelectors ?? "";
    return cy.get(`[data-cy="${selector}"] ${moreSelectors}`.trim(), options);
});

Cypress.Commands.add("await", <T>(promise: Promise<T>) => {
    return cy.then(() => {
        return cy.wrap(null, { log: false }).then(() => {
            return new Cypress.Promise((resolve, reject) => {
                try {
                    return promise.then(resolve);
                } catch (error) {
                    return reject(error);
                }
            });
        });
    });
});

Cypress.Commands.add("justWrap", (action: (...args: any[]) => any, options?: any) => {
    if (!options) {
        options = { log: false };
    };
    return cy.wrap(null, options).then(() => {
        return action();
    });
});


Cypress.Commands.add("waitForUrlToChange", (currentUrl: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    cy.wait(timeout);
    return cy.url().should("not.eq", currentUrl);
});

Cypress.Commands.add("assertElementsCount", (selector: string, count: number, lengthComparison: "equal" | "above" | "below" | "atMost" | "atLeast", options?: any) => {
    if (count <= 0)
        count = 0;
    switch (lengthComparison) {
        case "equal":
            return cy.get(selector, options).should("have.length", count);
        case "above":
            return cy.get(selector, options).should("have.length.above", count);
        case "below":
            return cy.get(selector, options).should("have.length.below", count);
        case "atLeast":
            return cy.get(selector, options).should("have.length.at.least", count);
        case "atMost":
            return cy.get(selector, options).should("have.length.at.most", count);
    }
});

Cypress.Commands.add("getCount", (selector: string, options?: any) => {
    return cy.get(selector, options).then($elements => {
        const countOfElements = $elements.length;
        return cy.wrap(countOfElements, { log: false });
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

Cypress.Commands.add("waitAndClick", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(selector, { timeout: timeout }).click();
});

Cypress.Commands.add("getByText", (text: string, timeout?: number) => {
    return cy.contains(text, { matchCase: false, includeShadowDom: true, timeout: timeout || 5000 });
});

Cypress.Commands.add("getByExactText", (text: string, timeout?: number) => {
    return cy.contains(text, { matchCase: true, includeShadowDom: true, timeout: timeout || 5000 });
});

Cypress.Commands.add("justType", (selector: string, text: string, pressEnter = false, options?: any) => {
    if (pressEnter)
        return cy.get(selector, options).type("{selectall}" + text + "{enter}")
    return cy.get(selector, options).type("{selectall}" + text);
});

Cypress.Commands.add("waitForType", (selector: string, text: string, timeout?: number, pressEnter = false, options?: any) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    cy.wait(timeout);
    if (pressEnter)
        return cy.get(selector, options).type("{selectall}" + text + "{enter}")
    return cy.get(selector, options).type("{selectall}" + text);
});

Cypress.Commands.add("waitForTypeByDataCy", (selector: string, text: string, timeout?: number, pressEnter = false, options?: any) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    cy.wait(timeout);
    if (pressEnter)
        return cy.get(`[data-cy="${selector}"]`, options).type("{selectall}" + text + "{enter}")
    return cy.get(`[data-cy="${selector}"]`, options).type("{selectall}" + text);
});

Cypress.Commands.add("clearAndType", (selector: string, text: string, pressEnter = false, options?: any) => {
    if (pressEnter)
        return cy.get(selector, options).clear().type("{selectall}" + text + "{enter}")
    return cy.get(selector, options).clear().type("{selectall}" + text);
});
Cypress.Commands.add("clearAndTypeByDataCy", (selector: string, text: string, pressEnter = false, options?: any) => {
    if (pressEnter)
        return cy.get(`[data-cy="${selector}"]`, options).clear().type("{selectall}" + text + "{enter}")
    return cy.get(`[data-cy="${selector}"]`, options).clear().type("{selectall}" + text);
});
Cypress.Commands.add("typeByDataCy", (selector: string, text: string, pressEnter = false, options?: any) => {
    if (pressEnter)
        return cy.get(`[data-cy="${selector}"]`, options).type("{selectall}" + text + "{enter}")
    return cy.get(`[data-cy="${selector}"]`, options).type("{selectall}" + text);
});
Cypress.Commands.add("waitForClearAndType", (selector: string, text: string, timeout?: number, pressEnter = false, options?: any) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    cy.wait(timeout);
    if (pressEnter)
        return cy.get(selector, options).clear().type("{selectall}" + text + "{enter}")
    return cy.get(selector, options).clear().type("{selectall}" + text);
});
Cypress.Commands.add("waitForClearAndTypeByDataCy", (selector: string, text: string, timeout?: number, pressEnter = false, options?: any) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    cy.wait(timeout);
    if (pressEnter)
        return cy.get(`[data-cy="${selector}"]`, options).clear().type("{selectall}" + text + "{enter}")
    return cy.get(`[data-cy="${selector}"]`, options).clear().type("{selectall}" + text);
});
Cypress.Commands.add("selectFromDropdown", (selector: string, value: string, options?: any) => {
    return cy.get(selector, options).select(value);
});

Cypress.Commands.add("hover", (selector: string, options?: any) => {
    return cy.get(selector, options).trigger("mouseover");
});
Cypress.Commands.add("waitForElement", (selector: string, timeout?: number) => {
    return cy.get(selector, { timeout: timeout || 5000 });
});
Cypress.Commands.add("waitForElementDataCy", (selector: string, timeout?: number) => {
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout || 5000 });
});
Cypress.Commands.add("waitForElementDataCyAdv", (selector: string, moreSelectors: string, timeout?: number) => {
    moreSelectors = moreSelectors ?? "";
    return cy.get(`[data-cy="${selector}"] ${moreSelectors}`.trim(), { timeout: timeout || 5000 });
});

Cypress.Commands.add("getInputValue", (selector: string, options?: any) => {
    return cy.get(selector, options).then(($input) => {
        return cy.wrap($input.val(), { log: false });
    });
});
Cypress.Commands.add("getParent", (selector: string, options?: any) => {
    return cy.get(selector, options).parent();
});

Cypress.Commands.add("getSibling", (selector: string, nth: number, options?: any) => {
    return cy.get(selector, options).siblings(":nth-child(" + nth + ")");
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
Cypress.Commands.add("getByClassStartsWith", (className: string, options?: any) => {
    return cy.get(`[class^="${className}"]`, options);
});
Cypress.Commands.add("getByClassEndsWith", (className: string, options?: any) => {
    return cy.get(`[class$="${className}"]`, options);
});
Cypress.Commands.add("getByClassContains", (className: string, options?: any) => {
    return cy.get(`[class*="${className}"]`, options);
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

Cypress.Commands.add("getByAriaDescribedBy", (ariaDescribedBy: string, options?: any) => {
    return cy.get(`[aria-describedby='${ariaDescribedBy}']`, options);
});
Cypress.Commands.add("getByAriaControls", (ariaControls: string, options?: any) => {
    return cy.get(`[aria-controls='${ariaControls}']`, options);
});
Cypress.Commands.add("getByAriaCurrent", (ariaCurrent: string, options?: any) => {
    return cy.get(`[aria-current='${ariaCurrent}']`, options);
});

Cypress.Commands.add("waitForInvisible", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(selector, { timeout: timeout || 5000 }).should("not.be.visible");
});
Cypress.Commands.add("waitForVisible", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(selector, { timeout: timeout || 5000 }).should("be.visible");
});
Cypress.Commands.add("waitForInvisibleDataCy", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout || 5000 }).should("not.be.visible");
});
Cypress.Commands.add("waitForVisibleDataCy", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout || 5000 }).should("be.visible");
});

Cypress.Commands.add("waitForExist", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(selector, { timeout: timeout || 5000 }).should("exist");
});
Cypress.Commands.add("waitForNotExist", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(selector, { timeout: timeout || 5000 }).should("not.exist");
});
Cypress.Commands.add("waitForExistDataCy", (selector: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout || 5000 }).should("exist");
});
Cypress.Commands.add("waitForNotExistDataCy", (selector: string, timeout) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.get(`[data-cy="${selector}"]`, { timeout: timeout || 5000 }).should("not.exist");
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

Cypress.Commands.add("getByAttribute", (attrName: string, attrValue: string, options?: any) => {
    return cy.get(`[${attrName}="${attrValue}"]`, options);
});
Cypress.Commands.add("getByAttributeStartsWith", (attrName: string, attrValue: string, options?: any) => {
    return cy.get(`[${attrName}^="${attrValue}"]`, options);
});
Cypress.Commands.add("getByAttributeEndsWith", (attrName: string, attrValue: string, options?: any) => {
    return cy.get(`[${attrName}$="${attrValue}"]`, options);
});
Cypress.Commands.add("getByAttributeContains", (attrName: string, attrValue: string, options?: any) => {
    return cy.get(`[${attrName}*="${attrValue}"]`, options);
});

Cypress.Commands.add("getAttribute", (selector: string, attribute: string, options?: any) => {
    return cy.get(selector, options).then($el => {
        return cy.wrap($el.attr(attribute), { log: false });
    });
});

Cypress.Commands.add("getAttributeDataCy", (selector: string, attribute: string, options?: any) => {
    return cy.get(`[data-cy="${selector}"]`, options).then($el => {
        return cy.wrap($el.attr(attribute), { log: false });
    });
});

Cypress.Commands.add("getAttributeDataCyAdv", (selector: string, attribute: string, moreSelectors: string, options?: any) => {
    moreSelectors = moreSelectors ?? "";
    return cy.get(`[data-cy="${selector}"] ${moreSelectors}`.trim(), options).then($el => {
        return cy.wrap($el.attr(attribute), { log: false });
    });
});

Cypress.Commands.add("getParentIf", (selector: string, condition: (parent: any) => boolean, options?: any) => {
    return cy.get(selector, options).parents().each($el => {
        if (condition($el)) return cy.wrap($el, { log: false });
    });
});
Cypress.Commands.add("getParentsIf", (selector: string, condition: (parent: any) => boolean, options?: any) => {
    const result: JQuery<HTMLElement>[] = [];
    cy.get(selector, options).parents().each($el => {
        if (condition($el)) result.push($el);
    });
    return cy.wrap(result, { log: false });
});

Cypress.Commands.add("getChildIf", (selector: string, condition: (child: any) => boolean, options?: any) => {
    return cy.get(selector, options).children().each($el => {
        if (condition($el)) return cy.wrap($el, { log: false });
    });
});

Cypress.Commands.add("getChildrenIf", (selector: string, condition: (child: any) => boolean, options?: any) => {
    const result: JQuery<HTMLElement>[] = [];
    cy.get(selector, options).children().each($el => {
        if (condition($el)) result.push($el);
    });
    return cy.wrap(result, { log: false });
});

Cypress.Commands.add("iterateChildren", (selector: string, callback: (child: any) => void, options?: any) => {
    return cy.get(selector, options).find("*").each(($el) => {
        callback($el);
    });
});

Cypress.Commands.add("iterateChildrenIf", (selector: string, condition: (child: any) => boolean, callback: (child: any) => void, options?: any) => {
    return cy.get(selector, options).find("*").each(($el) => {
        if (condition($el))
            callback($el);
    });
});

