import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { habitacionesController } from "../controllers/habitaciones.controller.js";



dotenv.config();

const router = Router();

router.get('/habitaciones',habitacionesController.habitaciones);
router.post('/guardarh',habitacionesController.guardarh);
router.get('/borrarh',habitacionesController.borrarh);




export default router;