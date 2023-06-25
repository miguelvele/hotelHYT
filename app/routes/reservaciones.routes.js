import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { reservacionesController } from "../controllers/reservaciones.controller.js";
import route from "./home.routes.js";


dotenv.config();

const router = Router();

router.get('/reservaciones', reservacionesController.reservaciones);
router.post('/guardarr', reservacionesController.guardarr);
router.get('/borrarr', reservacionesController.borrarr);
router.get('/salir', reservacionesController.salir);






export default router;