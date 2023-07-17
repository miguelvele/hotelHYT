import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { categoriaController } from "../controllers/categoria.controller.js";
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares



dotenv.config();

const router = Router();

router.get('/categorias', requireAuth, requireAdmin, categoriaController.categorias);
router.post('/guardarcate', categoriaController.guardarcate);
router.post('/guardarcategoria', categoriaController.guardarcategoria);
router.get('/borrarcate', categoriaController.borrarcate);
router.get('/salir', categoriaController.salir);
router.post('/generarpdf', categoriaController.generarpdf);
router.get('/editcatego', categoriaController.editcatego);







export default router;