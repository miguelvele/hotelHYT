import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { inicioController } from "../controllers/dashboard.controller.js";
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js'; // Importa los middlewares



dotenv.config();

const router = Router();

router.get('/inicio' , requireAuth, requireAdmin,inicioController.inicio);


router.get("/salir", (req, res) => {
    res.clearCookie("authToken");
    res.redirect("/");
});

// router.get("/edit-user", (req, res) => {
//     const id = req.query.id;
//     const codigo_tipo_usuario = req.query.codigo_tipo_usuario;
//     const tipo_documento = req.query.tipo_documento;
//     const documento = req.query.documento;
//     const nombre = req.query.nombre;
//     const apellido = req.query.apellido;
//     const correo = req.query.correo;
//     const clave = req.query.clave;
//     const estado = req.query.estado;
//     const fecha_creacion = req.query.fecha_creacion;

//     let datos = {
//         id: id,
//         codigo_tipo_usuario: codigo_tipo_usuario,
//         tipo_documento: tipo_documento,
//         documento: documento,
//         nombre: nombre,
//         apellido: apellido,
//         correo: correo,
//         clave: clave,
//         estado: estado,
//         fecha_creacion: fecha_creacion
//     }

//     if (req.cookies.ckmp) {
//         try {
//             const token = jwt.verify(
//                 req.cookies.ckmp,
//                 process.env.SECRET_KEY)
//             res.render("dash", {
//                 "nombre": token.nombre,
//                 "foto": token.foto,
//                 "menu": 4,
//                 "datos": datos
//             });

//         } catch (error) {
//             console.error("error con el token")
//         }
//     }


// })


export default router;