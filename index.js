'use strict';

module.exports = (callback, options) => {
    options = options || {};
    options.keepReference = typeof options.keepReference === 'undefined' || options.keepReference;

    const cache = {};
    const listeners = {};

    return function() {
        const args = arguments;
        const hash = JSON.stringify(args);

        cache[hash] = cache[hash] || {};
        listeners[hash] = listeners[hash] || [];

        // Already loading
        if(cache[hash].state === 'loading') {
            return new Promise(resolve => {
                listeners[hash][listeners[hash].length] = resolve;
            });
        }

        // Already loaded
        if(cache[hash].state === 'ready') {
            return Promise.resolve(cache[hash].result);
        }

        cache[hash].state = 'loading';
        listeners[hash] = [];
        return Promise.resolve(callback.apply(callback, args))
            .then(result => {
                for(let i = 0; i < listeners[hash].length; i++) {
                    listeners[hash][i](result);
                }

                cache[hash].state = 'ready';
                cache[hash].result = result;
                return result;
            });
    };
};
