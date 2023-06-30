import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"


import { getUserName } from './mainController.js';

const precio = async (req, res) => {
    

            let ruta = process.env.API + 'habitacion';
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



            res.render("precio", {
                
                "datos": datos,
                userName: getUserName(req.cookies.authToken)
            });
        }

        export const precioController ={
            precio
        }


        