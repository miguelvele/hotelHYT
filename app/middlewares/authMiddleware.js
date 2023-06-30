import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.redirect('/');
      }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.redirect('/');
    }
};

const requireAdmin = (req, res, next) => {
  if (req.user.type !== 1) {
    return res.redirect('/');
    }

  next();
};

const requireAuthJSON = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ customMessage: 'Debe iniciar sesión para acceder a este recurso' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ customMessage: 'Token inválido' });
  }
};

export { requireAuth, requireAdmin, requireAuthJSON };