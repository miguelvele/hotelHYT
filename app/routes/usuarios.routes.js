import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { usuarioController } from "../controllers/usuarios.controller.js";
import route from "./home.routes.js";


dotenv.config();

const router = Router();

router.get('/usuario', usuarioController.usuario);
router.post('/guardar', usuarioController.guardar);
router.get('/borrar', usuarioController.borrar);
router.get('/salir', usuarioController.salir);
router.get('/actualizar', usuarioController.actualizar);
router.post('/generarpdf', usuarioController.generarpdf);
router.get('/edituser', usuarioController.edituser);







export default router;