import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"

 const inicio = async (req, res) => {
    if (req.cookies.ckmp) {
        try {
            const token = jwt.verify(req.cookies.ckmp, process.env.SECRET_KEY);

            res.render("dash", {
                "nombre": token.nombre,
                "foto": token.foto,
                "menu": 0
            });

        } catch (error) {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
};

export const inicioController = {
    inicio
};

