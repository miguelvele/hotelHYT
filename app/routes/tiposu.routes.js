import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { tiposuController } from "../controllers/tiposu.controller.js";
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares



dotenv.config();

const router = Router();

router.get('/tiposu', requireAuth, requireAdmin, tiposuController.tiposu);
router.post('/guardartiposu', tiposuController.guardartiposu);
router.post('/guardartiposusuario', tiposuController.guardartiposusuario);
router.get('/borrartiposu', tiposuController.borrartiposu);
router.get('/salir', tiposuController.salir);
router.get('/actualizar', tiposuController.actualizar);
router.post('/generarpdf', tiposuController.generarpdf);
router.get('/edittiposu', tiposuController.edittiposu);







export default router;