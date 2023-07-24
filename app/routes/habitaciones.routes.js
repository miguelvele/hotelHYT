import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { habitacionesController } from "../controllers/habitaciones.controller.js";

import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares




dotenv.config();

const router = Router();

router.get('/habitaciones', requireAuth, requireAdmin, habitacionesController.habitaciones);
router.post('/guardarh',habitacionesController.guardarh);
router.post('/guardarhh', habitacionesController.guardarhh);
router.get('/borrarh',habitacionesController.borrarh);
router.get('/salir',habitacionesController.salir);
router.post('/generarpdfhabi',requireAuth, requireAdmin, habitacionesController.generarpdfhabi);

router.get('/edithabi',requireAuth, requireAdmin,habitacionesController.edithabi);







export default router;