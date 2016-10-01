'use strict';

const test = require('tape');
const bumper = require('./');

test('testFunction', t => {
    const callback = makeTestFunction();

    t.plan(3);

    callback()
        .then(result => t.equal(result.counter, 1))
        .then(callback)
        .then(result => t.equal(result.counter, 2))
        .then(callback)
        .then(result => t.equal(result.counter, 3));
});

test('bumpered testFunction should cache and return value', t => {
    const callback = bumper(makeTestFunction());

    t.plan(3);

    callback().then(result => t.equal(result.counter, 1));
    callback().then(result => t.equal(result.counter, 1));

    setTimeout(() => {
        callback().then(result => t.equal(result.counter, 1));
    }, 1);
});

test('bumpered testFunction should keep return value reference', t => {
    const callback = bumper(makeTestFunction());

    t.plan(3);

    let referencedObject;
    const shouldReferenceSameObject = result => {
        if(!referencedObject) {
            referencedObject = result;
        } else {
            t.equal(result, referencedObject);
        }
    };

    callback().then(shouldReferenceSameObject);
    callback().then(shouldReferenceSameObject);
    callback().then(shouldReferenceSameObject);

    setTimeout(() => {
        callback().then(shouldReferenceSameObject);
    }, 1);
});

test('bumpered testFunction should not only cache for equal arguments', t => {
    const callback = bumper(makeTestFunction());

    t.plan(10);

    callback().then(result => t.equal(result.counter, 1));
    callback('foo').then(result => t.equal(result.counter, 2));
    callback('foo').then(result => t.equal(result.counter, 2));
    callback('test', 'another').then(result => t.equal(result.counter, 3));
    callback('another', 'test').then(result => t.equal(result.counter, 4));

    setTimeout(() => {
        callback().then(result => t.equal(result.counter, 1));
        callback('foo').then(result => t.equal(result.counter, 2));
        callback('foo').then(result => t.equal(result.counter, 2));
        callback('test', 'another').then(result => t.equal(result.counter, 3));
        callback('another', 'test').then(result => t.equal(result.counter, 4));
    }, 1);
});

function makeTestFunction() {
    let counter = 0;
    return () => new Promise(resolve => setTimeout(() => resolve({ counter: ++counter }), 10));
}
