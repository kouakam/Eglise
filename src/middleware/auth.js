const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.redirect('/login');
};

const setUserLocals = (req, res, next) => {
    res.locals.user = req.session.userId ? { id: req.session.userId, username: req.session.username, role: req.session.role } : null;
    next();
};

module.exports = {
    isAuthenticated,
    setUserLocals
};
