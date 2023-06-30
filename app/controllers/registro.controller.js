import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";

import fs from "fs"


const registro = async (req, res) => {
    const nuevoUsuario = {
        codigo_tipo_usuario: req.body.CODIGO_TIPO_USUARIO,
        tipo_documento: req.body.TIPO_DOCUMENTO,
        documento: req.body.DOCUMENTO,
        nombre: req.body.NOMBRE,
        apellido: req.body.APELLIDO,
        correo: req.body.CORREO,
        clave: req.body.CLAVE,
        estado: req.body.ESTADO,
        fecha_creacion: req.body.FECHA_CREACION
    };
    console.log('nuevoUsuario', nuevoUsuario);
    axios.post(process.env.API + 'usuarios', nuevoUsuario)
        .then(response => {
            console.log(response.data);
            // Aquí puedes realizar alguna acción adicional o mostrar un mensaje de éxito.
            res.redirect('/login')

        })
        .catch(error => {
            console.error(error);
            // Aquí puedes manejar el error de alguna manera o mostrar un mensaje de error.
            res.json({ error: 'Error en el registro' }); // Redirige a una página de error o a donde desees.
        });
};

export default registro;