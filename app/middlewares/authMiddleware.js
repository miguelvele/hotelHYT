import jwt from 'jsonwebtoken';

const requireAuth = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Debe iniciar sesión para acceder a este recurso' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.type !== 1) {
    return res.status(403).json({ message: 'No tiene permiso para acceder a este recurso' });
  }

  next();
};

export { requireAuth, requireAdmin };