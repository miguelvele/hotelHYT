import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"

 const inicio = async (req, res) => {
    
        try {
           

            res.render("dash", {
                
                "menu": 0,
            });

        } catch (error) {
            res.redirect("/");
        }
   
};

export const inicioController = {
    inicio
};

