// middleware for 
const User = require('../models/User');

// gjør innlogget bruker tilgjengelig i alle views via res.locals.currentUser
exports.setCurrentUser = async (req, res, next) => {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId).select('username role');
      if (user) {
        res.locals.currentUser = user;
      }
    } catch (err) {
      console.error('Feil ved henting av bruker:', err.message);
    }
  }
  next();
};

// krever at bruker er logget inn
exports.requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('/login');
  }
  next();
};

// krever at bruker har en av de tillatte rollene
exports.requireRole = (...roles) => {
  return (req, res, next) => {
    const user = res.locals.currentUser;
    if (!user) {
      return res.redirect('/login');
    }
    if (!roles.includes(user.role)) {
      return res.status(403).render('error', {
        title: 'Ingen tilgang',
        message: 'Du har ikke tilgang til denne siden.'
      });
    }
    next();
  };
};
