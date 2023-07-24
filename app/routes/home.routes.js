// routes/index.js
import { Router } from 'express';
import {
  renderImagenes,
  renderServicios,
  renderContactenos,
  renderHabitaciones,
  renderLogin,
  renderRegistro,
  renderReserva,
  sendWhatsAppMessage,
} from '../controllers/mainController.js';
import { requireAuth, requireAuthJSON} from '../middlewares/authMiddleware.js';


const route = Router();
route.get('/check-auth', requireAuthJSON, (req, res) => {
  res.status(200).json({ message: 'Autenticado' });
});
route.post('/sendwhatsapp',sendWhatsAppMessage);
// Agrega esta ruta a tu servidor
route.get('/api/current-user', requireAuthJSON, (req, res) => {
  res.json({ codigo_usuario: req.user.id });
});
route.get('/api/url', (req, res) => {
  res.json({ url: process.env.API });
});

route.get('/imagenes', renderImagenes);
route.get('/servicios', renderServicios);
route.get('/contactenos', renderContactenos);
route.get('/', renderHabitaciones);
route.get('/login', renderLogin);
route.get('/registro', renderRegistro);
route.get('/reserva',requireAuth, renderReserva);

export default route;