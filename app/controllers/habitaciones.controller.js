import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"

const habitaciones = async (req, res) => {
    

        try {
           

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
                "menu": 2,
                "datos": datos,
            });

        } catch (error) {
            res.redirect("/");
        }
    
};


const guardarh = async (req, res) => {
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
const borrarh = async (req, res) => {
    const id = req.query.id;


    try {


        const url = `http://localhost:3000/api/habitacion/${id}`;
        const option = {
            method: "DELETE"
        };
        const result = await fetch(url, option)
            .then((response) => response.json())
            .then((data) => {
                if (data[0].affectedRows == 1) {
                    res.redirect(`/v1/habitaciones?success=true&id=${id}`);
                } else {
                    console.log("No se pudo borrar mi bro");
                    res.redirect(`/v1/habitaciones?success=false&id=${id}`);
                }
            });
    } catch (error) {
        console.error("Error con el token", error);
        res.redirect(`/v1/habitaciones?success=false&id=${id}`);
    }

};
const edithabi = async (req, res) => {
    const id = req.query.id;
    const codigo_usuario = req.query.codigo_usuario;
    const codigo_tipo_usuario = req.query.codigo_tipo_usuario;
    const tipo_documento = req.query.tipo_documento;
    const documento = req.query.documento;
    const nombre = req.query.nombre;
    const apellido = req.query.apellido;
    const correo = req.query.correo;
    const clave = req.query.clave;
    const estado = req.query.estado;
    const fecha_creacion = req.query.fecha_creacion;

    let datos = {
        id: id,
        codigo_usuario: codigo_usuario,
        codigo_tipo_usuario: codigo_tipo_usuario,
        tipo_documento: tipo_documento,
        documento: documento,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        clave: clave,
        estado: estado,
        fecha_creacion: fecha_creacion


    }


    try {
       
        res.render("dash", {
            
           
            "menu": 5,
            "datos": datos
        });

    } catch (error) {
        console.error("Errro con el token");
    }

}


const salir = async (req, res) => {
    res.clearCookie("ckmp");
    res.redirect("/");
};

export const habitacionesController = {
    habitaciones, guardarh, borrarh, salir, edithabi
}