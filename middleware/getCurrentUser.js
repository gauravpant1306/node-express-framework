function getCurrentUser() {
    return function (req, res, next) {
        // req.username = res.locals.oauth.token.user.name;
        // req.userid = res.locals.oauth.token.user.id;

        // call next middleware in the stack
        next();
    }
}

module.exports = { getCurrentUser }
