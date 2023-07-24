import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { metodoController } from "../controllers/metodopago.controller.js";
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares



dotenv.config();

const router = Router();

router.get('/metodopago', requireAuth, requireAdmin, metodoController.metodopago);
router.post('/guardarmetodo', metodoController.guardarmetodopago);
router.post('/guardarmeto', metodoController.guardarmetodo);
router.get('/borrarmetodo', metodoController.borrarmetodo);
router.get('/salir', metodoController.salir);
router.get('/actualizar', metodoController.actualizar);
router.post('/generarpdfmetodo', requireAuth, requireAdmin,metodoController.generarpdfmetodo);
router.get('/editmetodo',requireAuth, requireAdmin,metodoController.editmetodo);







export default router;