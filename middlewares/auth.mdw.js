module.exports = function restrict(req, res, next) {
    if (!req.session.isAuthenticated) {
      return res.redirect(`/login?retUrl=${req.originalUrl}`);
    }

    next();
}