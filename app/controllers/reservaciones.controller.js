import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"

const reservaciones = async (req, res) => {
    if (req.cookies.ckmp) {

        try {
            const token = jwt.verify(
                req.cookies.ckmp,
                process.env.SECRET_KEY
            )
           



            let ruta = "http://localhost:3000/api/reservas";
            let option = {
                method: "GET",
            }
            let datos = {};
            const result = await fetch(ruta, option)
                .then(response => response.json())
                .then(data => {
                    datos = data[0]
                    //console.log(data[0]);
                })
                .catch(err => console.error("error en peticion" + err))



            res.render("dash", {
                "nombre": token.nombre,
                "foto": token.foto,
                "menu": 3,
                "datos": datos,
                
            });

        } catch (error) {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
};
export const reservacionesController = {
    reservaciones
};