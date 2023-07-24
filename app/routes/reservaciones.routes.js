import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { reservacionesController } from "../controllers/reservaciones.controller.js";

import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares

import route from "./home.routes.js";


dotenv.config();

const router = Router();

router.get('/reservaciones',  requireAuth, requireAdmin, reservacionesController.reservaciones);
router.post('/guardarr', reservacionesController.guardarr);
router.get('/borrarr', reservacionesController.borrarr);
router.get('/salir', reservacionesController.salir);
router.get('/editreserva',requireAuth, requireAdmin, reservacionesController.editreserva);
router.post('/guardarre', reservacionesController.guardarre);
router.post('/generarpdfreser', requireAuth, requireAdmin,reservacionesController.generarpdfreser);









export default router;