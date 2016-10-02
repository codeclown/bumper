# Kaes

Cache results from function calls. Useful for e.g. AJAX.

## Usage

Kaes caches results from asynchronous function calls and returns them instead of calling the original function multiple times.

```
const getUser = userId => get(`/users/${id}`);
getUser(1).then(console.log); // Do AJAX request
getUser(1).then(console.log); // Do AJAX request again...
getUser(1).then(console.log); // ...and again

const cached = kaes(getUser);
cached(1).then(console.log); // Do AJAX request
cached(1).then(console.log); // No extra AJAX request
cached(1).then(console.log); // Still no extra AJAX request
cached(2).then(console.log); // Do AJAX request for different ID
cached(2).then(console.log); // And again, no extra AJAX request
```

Note: reference to original result is retained.

```
const getUser = userId => get(`/users/${id}`);
const cached = kaes(getUser);

cached(1).then(user => {
    return cached(1).then(cachedResult => {
        console.log(cachedResult === user); // true
    });
});
```

## Running tests

```
npm test
```

## License

MIT
