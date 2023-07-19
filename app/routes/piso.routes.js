import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { pisosController } from "../controllers/piso.controller.js";
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares



dotenv.config();

const router = Router();

router.get('/pisos', requireAuth, requireAdmin, pisosController.pisos);
router.post('/guardarpisos', pisosController.guardarpisos);
router.post('/guardarpiso', pisosController.guardarpiso);
router.get('/borrarpiso', pisosController.borrarpiso);
router.get('/salir', pisosController.salir);
router.get('/actualizar', pisosController.actualizar);
router.post('/generarpdf', pisosController.generarpdf);
router.get('/editpisos', requireAuth, requireAdmin,pisosController.editpisos);







export default router;