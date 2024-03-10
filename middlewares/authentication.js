const { verifyToken } = require("../service/authentication");

function checkAuth(cookieName) {
  return (req, res, next) => {
    const cookieToken = req.cookies[cookieName];
    if (!cookieToken) return next();

    try {
      const user = verifyToken(cookieToken);
      if (!user) return next();
      req.user = user;
      return next();
    } catch (error) {
      return next();
    }
  };
}

module.exports = { checkAuth };
