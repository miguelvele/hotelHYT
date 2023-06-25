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

const guardarr = async (req, res) => {
    const nuevaReservacion = {
        codigo_usuario: req.body.CODIGO_USUARIO,
        codigo_metodo_pago: req.body.CODIGO_METODO_PAGO,
        fecha_entrada: req.body.FECHA_ENTRADA,
        fecha_salida: req.body.FECHA_SALIDA,
        precio_inicial: req.body.PRECIO_INICIAL,
        adelanto: req.body.ADELANTO,
        precio_restante: req.body.PRECIO_RESTANTE,
        total_pagado: req.body.TOTAL_PAGADO,
        costo_penalidad: req.body.COSTO_PENALIDAD,
        observaciones: req.body.OBSERVACIONES,
        estado: req.body.ESTADO
    };

    axios.post('http://localhost:3000/api/reservas', nuevaReservacion)
        .then(response => {
            console.log(response.data);
            // Aquí puedes realizar alguna acción adicional o mostrar un mensaje de éxito.
            res.redirect("/v1/reservaciones");
        })
        .catch(error => {
            console.error(error);
            // Aquí puedes manejar el error de alguna manera o mostrar un mensaje de error.
            res.redirect('/error'); // Redirige a una página de error o a donde desees.
        });
};
const borrarr = async (req, res) => {
    const id = req.query.id;
  
    try {
      const url = `http://localhost:3000/api/reservas/${id}`;
      const option = {
        method: "DELETE",
      };
      const result = await fetch(url, option)
        .then((response) => response.json())
        .then((data) => {
          if (data[0].affectedRows == 1) {
            res.redirect(`/v1/reservaciones?success=true&id=${id}`);
          } else {
            console.log("No se pudo borrar mi bro");
            res.redirect(`/v1/reservaciones?success=false&id=${id}`);
          }
        });
    } catch (error) {
      console.error("Error con el token", error);
      res.redirect(`/v1/reservaciones?success=false&id=${id}`);
    }
  };
  
  const salir = async (req, res) => {
    res.clearCookie("ckmp");
    res.redirect("/");
};
  
  
export const reservacionesController = {
    reservaciones, guardarr, borrarr, salir
};