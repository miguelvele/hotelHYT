import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { estadoController } from "../controllers/estadohabitacion.controller.js";
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares



dotenv.config();

const router = Router();

router.get('/estadosh', requireAuth, requireAdmin, estadoController.estadosh);
router.post('/guardarestado', estadoController.guardarestado);
router.post('/guardarestados', estadoController.guardarestados);
router.get('/borrarestado', estadoController.borrarestado);
router.get('/salir', estadoController.salir);
router.get('/actualizar', estadoController.actualizar);
router.post('/generarpdf', estadoController.generarpdf);
router.get('/editestado', estadoController.editestado);







export default router;