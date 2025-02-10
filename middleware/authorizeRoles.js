function authorizeRoles(allowedRoles) {
  return (req, res, next) => {
    const user = req.user;
    if (user && allowedRoles.includes(user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied" });
    }
  };
}

module.exports = authorizeRoles;
