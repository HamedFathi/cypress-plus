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

Cypress.Commands.add("dataCy", (selector, ...args) => {
    if (selector) {
        return cy.get(`[data-cy="${selector}"]`, ...args);
    }
});

Cypress.Commands.add("dataCyAdv", (selector, moreSelectors, ...args) => {
    if (selector) {
        moreSelectors = moreSelectors ?? "";
        return cy.get(`[data-cy="${selector}"] ${moreSelectors}`.trim(), ...args);
    }
});

Cypress.Commands.add("promise", (promise: Promise<any>) => {
    return cy.then(() => promise);
});

Cypress.Commands.add("promiseOfT", <T>(promise: Promise<T>) => {
    return cy.then(() => promise);
});