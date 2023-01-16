"use strict";
/// <reference types="cypress" />
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function logCommand(_a) {
    var options = _a.options, originalOptions = _a.originalOptions;
    if (options.log) {
        options.logger({
            name: options.description,
            message: options.customLogMessage,
            consoleProps: function () { return originalOptions; },
        });
    }
}
function logCommandCheck(_a) {
    var result = _a.result, options = _a.options, originalOptions = _a.originalOptions;
    if (!options.log || !options.verbose)
        return;
    var message = [result];
    if (options.customLogCheckMessage) {
        message.unshift(options.customLogCheckMessage);
    }
    options.logger({
        name: options.description,
        message: message,
        consoleProps: function () { return originalOptions; },
    });
}
function polling(subject, checkFunction, originalOptions) {
    if (originalOptions === void 0) { originalOptions = {}; }
    if (!(checkFunction instanceof Function)) {
        throw new Error("'checkFunction' parameter should be a function. Found: " + checkFunction);
    }
    var defaultOptions = {
        interval: 200,
        timeout: 5000,
        retries: 25,
        errorMessage: 'Timed out retrying.',
        description: 'polling',
        log: true,
        customLogMessage: undefined,
        logger: Cypress.log,
        verbose: false,
        customLogCheckMessage: undefined,
        postFailure: undefined,
        mode: 'timeout',
        ignoreTimeoutError: false,
    };
    var options = __assign(__assign({}, defaultOptions), originalOptions);
    options.customLogMessage = [options.customLogMessage, originalOptions].filter(Boolean);
    var retries = 0;
    if (options.mode == 'timeout') {
        retries = Math.floor(options.timeout / options.interval);
        options.errorMessage = 'Timed out retrying.';
    }
    else {
        retries = options.retries;
        options.errorMessage = 'Retried too many times.';
    }
    var currentWaitTime;
    var waitTime = 0;
    if (Array.isArray(options.interval)) {
        waitTime = options.interval.reverse();
    }
    else {
        waitTime = options.interval;
    }
    if (Array.isArray(options.interval)) {
        if (options.interval.length > 1) {
            currentWaitTime = waitTime.pop();
        }
        else {
            currentWaitTime = waitTime[0];
        }
    }
    else {
        currentWaitTime = waitTime;
    }
    logCommand({ options: options, originalOptions: originalOptions });
    var check = function (result) {
        logCommandCheck({ result: result, options: options, originalOptions: originalOptions });
        if (Array.isArray(options.interval)) {
            if (options.interval.length > 1) {
                currentWaitTime = waitTime.pop();
            }
            else {
                currentWaitTime = waitTime[0];
            }
        }
        else {
            currentWaitTime = waitTime;
        }
        if (result) {
            return result;
        }
        if (retries < 1) {
            var msg = options.errorMessage instanceof Function ? options.errorMessage(result, options) : options.errorMessage;
            if (options.postFailure && options.postFailure instanceof Function)
                options.postFailure();
            if (!options.ignoreTimeoutError)
                throw new Error(msg);
        }
        if (currentWaitTime) {
            cy.wait(currentWaitTime, { log: false }).then(function () {
                retries--;
                return resolveValue();
            });
        }
    };
    var resolveValue = function () {
        var result = checkFunction(subject);
        var isAPromise = Boolean(result && result.then);
        if (isAPromise) {
            return result.then(check);
        }
        else {
            return check(result);
        }
    };
    return resolveValue();
}
Cypress.Commands.add("polling", { prevSubject: "optional" }, polling);
Cypress.Commands.add("getByDataCy", function (selector, options) {
    return cy.get("[data-cy=\"".concat(selector, "\"]"), options);
});
Cypress.Commands.add("getByData", function (dataName, selector, options) {
    return cy.get("[data-".concat(dataName, "=\"").concat(selector, "\"]"), options);
});
Cypress.Commands.add("getByDataAdv", function (dataName, selector, moreSelectors, options) {
    moreSelectors = moreSelectors !== null && moreSelectors !== void 0 ? moreSelectors : "";
    return cy.get("[data-".concat(dataName, "=\"").concat(selector, "\"] ").concat(moreSelectors).trim(), options);
});
Cypress.Commands.add("getByDataCyAdv", function (selector, moreSelectors, options) {
    moreSelectors = moreSelectors !== null && moreSelectors !== void 0 ? moreSelectors : "";
    return cy.get("[data-cy=\"".concat(selector, "\"] ").concat(moreSelectors).trim(), options);
});
Cypress.Commands.add("promise", function (promise) {
    return cy.then(function () { return promise; });
});
Cypress.Commands.add("waitForUrlToChange", function (currentUrl, timeout) {
    if (timeout <= 0)
        timeout = 0;
    cy.wait(timeout);
    return cy.url().should("not.eq", currentUrl);
});
Cypress.Commands.add("scrollTo", function (selector, options) {
    return cy.get(selector, options).scrollIntoView();
});
Cypress.Commands.add("assertElementsCount", function (selector, count, lengthComparison, options) {
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
Cypress.Commands.add("getCount", function (selector, options) {
    return cy.get(selector, options).then(function ($elements) {
        var countOfElements = $elements.length;
        return cy.wrap(countOfElements);
    });
});
Cypress.Commands.add("getByAriaLabel", function (ariaLabel, options) {
    return cy.get("[aria-label=\"".concat(ariaLabel, "\"]"), options);
});
Cypress.Commands.add("getByTitle", function (title, options) {
    return cy.get("[title=\"".concat(title, "\"]"), options);
});
Cypress.Commands.add("getByAlt", function (alt, options) {
    return cy.get("[alt=\"".concat(alt, "\"]"), options);
});
Cypress.Commands.add("getByPlaceholder", function (placeholder, options) {
    return cy.get("[placeholder=\"".concat(placeholder, "\"]"), options);
});
Cypress.Commands.add("getByValue", function (value, options) {
    return cy.get("[value=\"".concat(value, "\"]"), options);
});
Cypress.Commands.add("waitAndClick", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).click();
});
Cypress.Commands.add("getByText", function (text, timeout) {
    return cy.contains(text, { matchCase: false, includeShadowDom: true, timeout: timeout });
});
Cypress.Commands.add("getByExactText", function (text, timeout) {
    return cy.contains(text, { matchCase: true, includeShadowDom: true, timeout: timeout });
});
Cypress.Commands.add("clearAndType", function (selector, text, pressEnter, options) {
    if (pressEnter === void 0) { pressEnter = false; }
    if (pressEnter)
        return cy.get(selector, options).clear().type(text + '{enter}');
    return cy.get(selector, options).clear().type(text);
});
Cypress.Commands.add("waitForClearAndType", function (selector, text, timeout, pressEnter, options) {
    if (pressEnter === void 0) { pressEnter = false; }
    if (timeout <= 0)
        timeout = 0;
    cy.wait(timeout);
    if (pressEnter)
        return cy.get(selector, options).clear().type(text + '{enter}');
    return cy.get(selector, options).clear().type(text);
});
Cypress.Commands.add("selectFromDropdown", function (selector, value, options) {
    return cy.get(selector, options).select(value);
});
Cypress.Commands.add("hover", function (selector, options) {
    return cy.get(selector, options).trigger("mouseover");
});
Cypress.Commands.add("waitForElement", function (selector, timeout) {
    return cy.get(selector, { timeout: timeout });
});
Cypress.Commands.add("waitForElementDataCy", function (selector, timeout) {
    return cy.get("[data-cy=\"".concat(selector, "\"]"), { timeout: timeout });
});
Cypress.Commands.add("waitForElementDataCyAdv", function (selector, moreSelectors, timeout) {
    moreSelectors = moreSelectors !== null && moreSelectors !== void 0 ? moreSelectors : "";
    return cy.get("[data-cy=\"".concat(selector, "\"] ").concat(moreSelectors).trim(), { timeout: timeout });
});
Cypress.Commands.add("getInputValue", function (selector, options) {
    return cy.get(selector, options).then(function ($input) {
        return cy.wrap($input.val());
    });
});
Cypress.Commands.add("getParent", function (selector, options) {
    return cy.get(selector, options).parent();
});
Cypress.Commands.add("getSibling", function (selector, nth, options) {
    return cy.get(selector, options).siblings(':nth-child(' + nth + ')');
});
Cypress.Commands.add("getNthChild", function (selector, nth, options) {
    return cy.get(selector, options).children().eq(nth);
});
Cypress.Commands.add("checkCheckbox", function (selector, options) {
    return cy.get(selector, options).check();
});
Cypress.Commands.add("uncheckCheckbox", function (selector, options) {
    return cy.get(selector, options).uncheck();
});
Cypress.Commands.add("getByClass", function (className, options) {
    return cy.get(".".concat(className), options);
});
Cypress.Commands.add("clickButton", function (buttonText, options) {
    return cy.get("button:contains(\"".concat(buttonText, "\")"), options).click();
});
Cypress.Commands.add("clickLink", function (linkText, options) {
    return cy.get("link:contains(\"".concat(linkText, "\")"), options).click();
});
Cypress.Commands.add("getByRole", function (role, options) {
    return cy.get("[role=".concat(role, "]"), options);
});
Cypress.Commands.add("getByName", function (name, options) {
    return cy.get("[name=".concat(name, "]"), options);
});
Cypress.Commands.add("getByHref", function (href, options) {
    return cy.get("a[href='".concat(href, "']"), options);
});
Cypress.Commands.add("getFirst", function (selector, options) {
    return cy.get(selector, options).first();
});
Cypress.Commands.add("getLast", function (selector, options) {
    return cy.get(selector, options).last();
});
Cypress.Commands.add("getFirstNth", function (selector, nth, options) {
    return cy.get(selector, options).first().nextAll().eq(nth);
});
Cypress.Commands.add("getLastNth", function (selector, nth, options) {
    return cy.get(selector, options).last().prevAll().eq(nth);
});
Cypress.Commands.add("focus", function (selector, options) {
    return cy.get(selector, options).focus();
});
Cypress.Commands.add("getByAriaDescribedBy", function (ariaDescribedBy, options) {
    return cy.get("[aria-describedby='".concat(ariaDescribedBy, "']"), options);
});
Cypress.Commands.add("getByAriaControls", function (ariaControls, options) {
    return cy.get("[aria-controls='".concat(ariaControls, "']"), options);
});
Cypress.Commands.add("getByAriaCurrent", function (ariaCurrent, options) {
    return cy.get("[aria-current='".concat(ariaCurrent, "']"), options);
});
Cypress.Commands.add("waitForInvisible", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('not.be.visible');
});
Cypress.Commands.add("waitForVisible", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('be.visible');
});
Cypress.Commands.add("waitForInvisibleDataCy", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get("[data-cy=\"".concat(selector, "\"]"), { timeout: timeout }).should('not.be.visible');
});
Cypress.Commands.add("waitForVisibleDataCy", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get("[data-cy=\"".concat(selector, "\"]"), { timeout: timeout }).should('be.visible');
});
Cypress.Commands.add("waitForExist", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('exist');
});
Cypress.Commands.add("waitForNotExist", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get(selector, { timeout: timeout }).should('not.exist');
});
Cypress.Commands.add("waitForExistDataCy", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get("[data-cy=\"".concat(selector, "\"]"), { timeout: timeout }).should('exist');
});
Cypress.Commands.add("waitForNotExistDataCy", function (selector, timeout) {
    if (timeout <= 0)
        timeout = 0;
    return cy.get("[data-cy=\"".concat(selector, "\"]"), { timeout: timeout }).should('not.exist');
});
Cypress.Commands.add("goBack", function () {
    return cy.go("back");
});
Cypress.Commands.add("goForward", function () {
    return cy.go("forward");
});
Cypress.Commands.add("clearSessionAndCookies", function () {
    return cy.window().then(function (win) {
        win.sessionStorage.clear();
        cy.clearCookies();
        cy.clearLocalStorage();
    });
});
Cypress.Commands.add("getAttribute", function (selector, attribute, options) {
    return cy.get(selector, options).then(function ($el) {
        return cy.wrap($el.attr(attribute));
    });
});
Cypress.Commands.add("getAttributeDataCy", function (selector, attribute, options) {
    return cy.get("[data-cy=\"".concat(selector, "\"]"), options).then(function ($el) {
        return cy.wrap($el.attr(attribute));
    });
});
Cypress.Commands.add("getAttributeDataCyAdv", function (selector, attribute, moreSelectors, options) {
    moreSelectors = moreSelectors !== null && moreSelectors !== void 0 ? moreSelectors : "";
    return cy.get("[data-cy=\"".concat(selector, "\"] ").concat(moreSelectors).trim(), options).then(function ($el) {
        return cy.wrap($el.attr(attribute));
    });
});
Cypress.Commands.add("getParentIf", function (selector, condition, options) {
    return cy.get(selector, options).parents().each(function ($el) {
        if (condition($el))
            return cy.wrap($el);
    });
});
Cypress.Commands.add("getParentsIf", function (selector, condition, options) {
    var result = [];
    cy.get(selector, options).parents().each(function ($el) {
        if (condition($el))
            result.push($el);
    });
    return cy.wrap(result);
});
Cypress.Commands.add("getChildIf", function (selector, condition, options) {
    return cy.get(selector, options).children().each(function ($el) {
        if (condition($el))
            return cy.wrap($el);
    });
});
Cypress.Commands.add("getChildrenIf", function (selector, condition, options) {
    var result = [];
    cy.get(selector, options).children().each(function ($el) {
        if (condition($el))
            result.push($el);
    });
    return cy.wrap(result);
});
Cypress.Commands.add("iterateChildren", function (selector, callback, options) {
    return cy.get(selector, options).find('*').each(function ($el) {
        callback($el);
    });
});
Cypress.Commands.add("iterateChildrenIf", function (selector, condition, callback, options) {
    return cy.get(selector, options).find('*').each(function ($el) {
        if (condition($el))
            callback($el);
    });
});
//# sourceMappingURL=commands.js.map