// routes/index.js
import { Router } from 'express';
import {
  renderImagenes,
  renderServicios,
  renderContactenos,
  renderIndex,
  renderLogin,
  renderRegistro,
  renderReserva,
} from '../controllers/mainController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';


const route = Router();

route.get('/imagenes', renderImagenes);
route.get('/servicios', renderServicios);
route.get('/contactenos', renderContactenos);
route.get('/', renderIndex);
route.get('/login', renderLogin);
route.get('/registro', renderRegistro);
route.get('/reserva',requireAuth, renderReserva);

export default route;