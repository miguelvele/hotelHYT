import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"

const habitaciones = async (req, res) => {
    if (req.cookies.ckmp) {
        
        try {
            const token = jwt.verify(
                req.cookies.ckmp,
                process.env.SECRET_KEY
            )

            let ruta = "http://localhost:3000/api/habitacion";
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
                "menu": 2,
                "datos": datos,
            });

        } catch (error) {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
};


const guardarh = async(req, res) => {
    const nuevaHabitacion = {
       
        codigo_piso: req.body.CODIGO_PISO,
        codigo_categoria: req.body.CODIGO_CATEGORIA,
        codigo_hotel: req.body.CODIGO_HOTEL,
        codigo_estado_habitacion: req.body.CODIGO_ESTADO_HABITACION,
        detalle: req.body.DETALLE,
        precio: req.body.PRECIO,
        estado: req.body.ESTADO,
        fecha_creacion: req.body.FECHA_CREACION
    };

    axios.post('http://localhost:3000/api/habitacion', nuevaHabitacion)
        .then(response => {
            console.log(response.data);
            // Aquí puedes realizar alguna acción adicional o mostrar un mensaje de éxito.
            res.redirect("/v1/habitaciones");
        })
        .catch(error => {
            console.error(error);
            // Aquí puedes manejar el error de alguna manera o mostrar un mensaje de error.
            res.redirect('/error'); // Redirige a una página de error o a donde desees.
        });
};
const borrarh = async (req, res) =>{
    const id = req.query.id;


        try {
            

                const url = `http://localhost:3000/api/habitacion/${id}`;
                const option={
                    method:"DELETE"
                };
                const result = await fetch(url, option )
                .then(response=>response.json())
                .then(data=>{
                    if (data[0].affectedRows==1){
                        // console.log("borrado mi bro");
                        
                    }else{
                        console.log("no se pudo borrar mi bro");
                    }
                })
                res.redirect("/v1/habitaciones")
        } catch (error) {
            console.error("Error con el token", error);
        }
    
};

export const habitacionesController = {
  habitaciones, guardarh, borrarh
}