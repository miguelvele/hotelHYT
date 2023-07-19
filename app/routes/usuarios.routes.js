import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { usuarioController } from "../controllers/usuarios.controller.js";
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares



dotenv.config();

const router = Router();

router.get('/usuario', requireAuth, requireAdmin, usuarioController.usuario);
router.post('/guardaru', usuarioController.guardaru);
router.post('/guardar', usuarioController.guardar);
router.get('/borrar', usuarioController.borrar);
router.get('/salir', usuarioController.salir);
router.get('/actualizar', usuarioController.actualizar);
router.post('/generarpdfu', requireAuth, requireAdmin,usuarioController.generarpdfu);
router.get('/edituser',requireAuth, requireAdmin, usuarioController.edituser);







export default router;