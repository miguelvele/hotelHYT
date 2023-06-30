import { Router } from 'express';
import registro from '../controllers/registro.controller.js';

const route = Router();

route.post('/guardar',registro);

export default route;