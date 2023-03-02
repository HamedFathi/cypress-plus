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
        waitTime = options.interval.reverse();
    } else {
        waitTime = options.interval;
    }
    if (Array.isArray(options.interval)) {
        if (options.interval.length > 1) {
            currentWaitTime = (<number[]>waitTime).pop();
        } else {
            currentWaitTime = waitTime[0];
        }
    } else {
        currentWaitTime = <number>waitTime;
    }

    logCommand({ options, originalOptions });

    const check = (result: any) => {
        logCommandCheck({ result, options, originalOptions })
        if (Array.isArray(options.interval)) {
            if (options.interval.length > 1) {
                currentWaitTime = (<number[]>waitTime).pop();
            } else {
                currentWaitTime = waitTime[0];
            }
        } else {
            currentWaitTime = <number>waitTime;
        }
        if (result) {
            return result;
        }
        if (retries < 1) {
            const msg = options.errorMessage instanceof Function ? options.errorMessage(result, options) : options.errorMessage
            if (options.postFailureAction && options.postFailureAction instanceof Function)
                options.postFailureAction();
            if (!options.ignoreTimeoutError && !options.postFailureAction)
                throw new Error(msg);
            return;
        }
        if (currentWaitTime) {
            cy.wait(currentWaitTime, { log: false }).then(() => {
                retries--
                return resolveValue();
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

Cypress.Commands.add("await", <T>(promise: Promise<T>, wait?: number) => {
    return cy.then(() => {
        return cy.wrap(null, { log: false }).then(() => {
            if (wait && wait > 0) {
                cy.wait(wait);
            }
            return new Cypress.Promise((resolve, reject) => {
                return promise.then(resolve, reject).catch(error => {
                    return reject(error);
                });
            });
        });
    });
});

Cypress.Commands.add("awaitFor", (promise: Promise<unknown>, wait?: number) => {
    return cy.then(() => {
        return cy.wrap(null, { log: false }).then(() => {
            if (wait && wait > 0) {
                cy.wait(wait);
            }
            return new Cypress.Promise((resolve, reject) => {
                return promise.then(resolve, reject).catch(error => {
                    return reject(error);
                });
            });
        });
    });
});

Cypress.Commands.add("justWrap", (action: (...args: any[]) => any, wait?: number, options?: any) => {
    if (!options) {
        options = { log: false };
    };
    return cy.wrap(null, options).then(() => {
        if (wait && wait > 0) {
            cy.wait(wait);
        }
        return action();
    });
});

Cypress.Commands.add("waitForUrlToChange", (currentUrl: string, timeout?: number) => {
    if (!timeout || timeout <= 0)
        timeout = 5000;
    return cy.polling(() => {
        cy.url().then(url => {
            return url != currentUrl;
        })
    }, { mode: "timeout", timeout: timeout, interval: 100 }).then(() => {
        return cy.url().should("not.eq", currentUrl);
    });
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

Cypress.Commands.add("isEmpty", (selector: string, options?: any) => {
    return cy.get(selector, options).should('be.empty');
});

Cypress.Commands.add("isNotEmpty", (selector: string, options?: any) => {
    return cy.get(selector, options).should('not.be.empty');
});

Cypress.Commands.add("hasValue", (selector: string, value: string, options?: any) => {
    return cy.get(selector, options).should('have.value', value);
});

Cypress.Commands.add("doesNotHaveValue", (selector: string, value: string, options?: any) => {
    return cy.get(selector, options).should('have.value', value);
});

Cypress.Commands.add("hasClass", (selector: string, value: string, options?: any) => {
    return cy.get(selector, options).should('have.class', value);
});

Cypress.Commands.add("doesNotHaveClass", (selector: string, value: string, options?: any) => {
    return cy.get(selector, options).should('not.have.class', value)
});

Cypress.Commands.add("isVisible", (selector: string, options?: any) => {
    return cy.get(selector, options).should('be.visible');
});

Cypress.Commands.add("isNotVisible", (selector: string, options?: any) => {
    return cy.get(selector, options).should('not.be.visible');
});

Cypress.Commands.add("checkURL", (url: string) => {
    return cy.url().should('include', url);
});

Cypress.Commands.add("invokeText", (selector: string, options?: any) => {
    return cy.get(selector, options).invoke('text').then(value => {
        return cy.wrap(value);
    });
});

Cypress.Commands.add("invokeTextByDataCy", (selector: string, options?: any) => {
    return cy.get(`[data-cy="${selector}"]`, options).invoke('text').then(value => {
        return cy.wrap(value);
    });
});

Cypress.Commands.add("hasAttribute", (selector: string, attribute: string, value: string, options?: any) => {
    return cy.get(selector, options).should('have.attr', attribute, value)
});

Cypress.Commands.add("doesNotHaveAttribute", (selector: string, attribute: string, value: string, options?: any) => {
    return cy.get(selector, options).should('not.have.attr', attribute, value)
});

export abstract class Ability<T> {
    public abstract can(): T;
}

export class UseCypress extends Ability<Cypress.cy & CyEventEmitter> {
    public can(): Cypress.cy & CyEventEmitter {
        return cy;
    }
}

export abstract class Interaction {
    public abstract attemptAs(actor: Actor): Cypress.Chainable<unknown>;
}

export abstract class Task {
    constructor(private readonly interactions: Interaction[]) { }

    public getInteractions(): Interaction[] {
        return this.interactions;
    }

    public attemptInteractionsAs(actor: Actor): void {
        for (const interaction of this.getInteractions()) {
            interaction.attemptAs(actor);
        }
    }

    public attemptInteractionAs(actor: Actor,
        interactionClass: new (...args: never[]) => Interaction
    ): Cypress.Chainable<unknown> {
        const matchingInteractions = this.interactions?.filter(
            (a) => a instanceof interactionClass
        ) as Interaction[];
        if (matchingInteractions.length === 0) {
            throw new Error(
                `Interaction with name of '${interactionClass.name}' not found.`
            );
        }
        return matchingInteractions[0].attemptAs(actor);
    }

    public abstract performAs(actor: Actor): Cypress.Chainable<unknown>;
}

export abstract class Question {
    public abstract askAs(actor: Actor): Cypress.Chainable<unknown>;
}

export class Actor {
    constructor(private readonly abilities?: Ability<unknown>[]) { }

    public useAbility<T>(
        abilityClass: new (...args: never[]) => Ability<T>
    ): T {
        const matchingAbilities = this.abilities?.filter(
            (a) => a instanceof abilityClass
        ) as Ability<T>[];
        if (matchingAbilities.length === 0) {
            throw new Error(
                `Actor does not have ability with name of '${abilityClass.name}'.`
            );
        }
        return matchingAbilities[0].can();
    }

    public performs(
        taskOrInteraction: Task | Task[] | Interaction | Interaction[]
    ): Cypress.Chainable<unknown> | undefined {
        if (taskOrInteraction instanceof Task) {
            return taskOrInteraction.performAs(this);
        }
        if (taskOrInteraction instanceof Interaction) {
            return taskOrInteraction.attemptAs(this);
        }
        if (
            Array.isArray(taskOrInteraction) &&
            taskOrInteraction.length > 0 &&
            taskOrInteraction[0] instanceof Task
        ) {
            for (const interaction of taskOrInteraction) {
                (interaction as Task).performAs(this);
            }
            return;
        }
        if (
            Array.isArray(taskOrInteraction) &&
            taskOrInteraction.length > 0 &&
            taskOrInteraction[0] instanceof Interaction
        ) {
            for (const interaction of taskOrInteraction) {
                (interaction as Interaction).attemptAs(this);
            }
            return;
        }
    }

    public asserts<T>(
        question: Question,
        assert: (answer: T) => void
    ): void {
        question.askAs(this).then((answer: unknown) => {
            assert(answer as T);
        });
    }

    public asksAbout<T>(question: Question): Cypress.Chainable<T> {
        return question.askAs(this) as Cypress.Chainable<T>;
    }
}

export type PollingLog = Pick<Cypress.LogConfig, "name" | "message" | "consoleProps">;

export type PollingErrorMsgCallback<Subject = any> = (result: Subject, options: PollingOptions<Subject>) => string;
export interface PollingOptions<Subject = any> {
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
    mode: "timeout" | "retry",
    ignoreTimeoutError?: boolean,
    postFailureAction?: () => void,
}

// TypeScript declaration
declare global {
    namespace Cypress {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        interface Chainable<Subject = any> {

            getByDataCyContains<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
            getByDataCyStartsWith<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
            getByDataCyEndsWith<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

            getByDataCy<E extends Node = HTMLElement>(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow & Cypress.ActionableOptions>): Chainable<JQuery<E>>;
            getByDataCyAdv<E extends Node = HTMLElement>(selector: string, moreSelectors: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

            waitForUrlAndVisible(url: string, selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForUrlAndVisibleDataCy(url: string, selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;

            clickOnDataCy(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            rightClickOnDataCy(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

            getByDataContains<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
            getByDataStartsWith<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
            getByDataEndsWith<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

            getByData<E extends Node = HTMLElement>(dataName: string, selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;
            getByDataAdv<E extends Node = HTMLElement>(dataName: string, selector: string, moreSelectors: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<E>>;

            await<T>(promise: Promise<T>, wait?: number): Chainable<T>;
            awaitFor(promise: Promise<unknown>, wait?: number): Chainable<unknown>;
            justWrap(action: (...args: any[]) => any, wait?: number, options?: Partial<Loggable & Timeoutable>): Chainable<any>;

            waitForUrlToChange(currentUrl: string, timeout?: number): Chainable<string>;

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

            waitAndClick(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            getByText(selector: string, timeout?: number): Chainable<any>;
            getByExactText(selector: string, timeout?: number): Chainable<any>;
            justType(selector: string, text: string, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            clearAndType(selector: string, text: string, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            waitForClearAndType(selector: string, text: string, timeout?: number, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            clearAndTypeByDataCy(selector: string, text: string, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            typeByDataCy(selector: string, text: string, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            waitForTypeByDataCy(selector: string, text: string, timeout?: number, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            waitForType(selector: string, text: string, timeout?: number, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

            waitForClearAndTypeByDataCy(selector: string, text: string, timeout?: number, pressEnter?: boolean, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

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

            waitForNotExistDataCy(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForNotExist(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForExistDataCy(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForExist(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForInvisibleDataCy(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForInvisible(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForVisibleDataCy(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForVisible(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;
            waitForElement<E extends Node = HTMLElement>(selector: string, timeout?: number): Chainable<JQuery<E>>;
            waitForElementDataCy<E extends Node = HTMLElement>(selector: string, timeout?: number): Chainable<JQuery<E>>;
            waitForElementDataCyAdv<E extends Node = HTMLElement>(selector: string, moreSelectors: string, timeout?: number): Chainable<JQuery<E>>;

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

            isEmpty(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            isNotEmpty(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            hasValue(selector: string, value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            doesNotHaveValue(selector: string, value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            hasClass(selector: string, value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            doesNotHaveClass(selector: string, value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            isVisible(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            isNotVisible(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            checkURL(url: string): Chainable<string>;
            invokeText(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<string>;
            invokeTextByDataCy(selector: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<string>;
            hasAttribute(selector: string, attribute: string, value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;
            doesNotHaveAttribute(selector: string, attribute: string, value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElement>>;

            polling<ReturnType = any>(
                checkFunction: (subject: Subject | undefined) => ReturnType | Chainable<ReturnType> | Promise<ReturnType>,
                options?: PollingOptions<Subject>,
            ): Chainable<Subject>;
        }
    }
}