module.exports = function permit(...permittedRoles) {
    // return a middleware
    return (request, response, next) => {
      const user = request.session.authUser;
      if (user && permittedRoles.includes(user.role)) {
        next(); // role is allowed, so continue on the next middleware
      } else {
        response.status(403).json({message: "Forbidden"}); // user is forbidden
      }
    }
  }