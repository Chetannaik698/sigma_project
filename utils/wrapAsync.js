function wrapAsync(fn) {
    return function (req, res, next) {
        // Ensure fn is called and its returned Promise is properly chained
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

module.exports = wrapAsync;
