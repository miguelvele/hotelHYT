import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import moment from 'moment-timezone';
import bodyParser from 'body-parser';

import axios from "axios";
import fs from "fs"

const habitaciones = async (req, res) => {


    try {


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



        res.render("dash", {
            name: req.user.name,
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

    axios.post(process.env.API + 'habitacion', nuevaHabitacion)
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


        const url = process.env.API + 'habitacion' + `/${id}`;
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
    const codigo_piso = req.query.codigo_piso;
    const codigo_categoria = req.query.codigo_categoria;
    const codigo_hotel = req.query.codigo_hotel;
    const codigo_estado_habitacion = req.query.codigo_estado_habitacion;
    const detalle = req.query.detalle;
    const precio = req.query.precio;
    const estado = req.query.estado;
    const fecha_creacion = req.query.fecha_creacion;

    let datos = {
        id: id,
        codigo_piso: codigo_piso,
        codigo_categoria: codigo_categoria,
        codigo_hotel: codigo_hotel,
        codigo_estado_habitacion: codigo_estado_habitacion,
        detalle: detalle,
        precio: precio,
        estado: estado,
        fecha_creacion: fecha_creacion
    }


    try {

        res.render("dash", {

            name: req.user.name,
            "menu": 5,
            "datos": datos
        });

    } catch (error) {
        console.error("Errro con el token");
    }

}

const guardarhh = async (req, res) => {

    let data = {
        id: req.body.id,
        codigo_piso: req.body.codigo_piso,
        codigo_categoria: req.body.codigo_categoria,
        codigo_hotel: req.body.codigo_hotel,
        codigo_estado_habitacion: req.body.codigo_estado_habitacion,
        detalle: req.body.detalle,
        precio: req.body.precio,
        estado: req.body.estado,
        fecha_creacion: req.body.fecha_creacion
    }
    let metodo = "put";

    let ruta = process.env.API + 'habitacion/' + req.body.id;

    let option = {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }
    try {
        const result = await fetch(ruta, option)
            .then(async res => {
                const responseBody = await res.text();
                console.log('Respuesta completa:', responseBody);
                // Convertir a JSON solo si la respuesta es exitosa
                if (res.ok) {
                    return JSON.parse(responseBody);
                } else {
                    throw new Error(`Error al consumir API: ${res.status} ${res.statusText}`);
                }
            })
            .then(data => {
                console.log("Datos guardados");
            })
            .catch(err => console.log("erro al consumir api " + err));
        res.redirect("/v1/habitaciones");
    } catch (error) {

    }
}


const salir = async (req, res) => {
    res.clearCookie("ckmp");
    res.redirect("/");
};


const generarpdfhabi = async (req, res) => {
    try {
        const formato = req.body.formato; // Obtener el parámetro "formato" de la solicitud POST

        // Hacer una solicitud GET a la API para obtener la información
        const response = await axios.get(process.env.API + 'habitacion');
        const userData = response.data[0]; // Obtener el primer elemento del arreglo

        // Mostrar información por consola
        console.log('Información del las habitaciones:');

        userData.forEach((usuarios) => {
            console.log(`Nombre: ${usuarios.NUMERO_HABITACION}`);
            
        });

        if (formato === 'pdf') {
            // Crear un nuevo documento PDF
            const doc = new PDFDocument();

            // Stream el contenido PDF a la respuesta HTTP
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=habitaciones.pdf');
            doc.pipe(res);

            // Agregar contenido al PDF
            doc.fontSize(20).text('Información de las Habitaciones', { align: 'center' });
            doc.fontSize(16).text('Generado por:  miguel angel', { align: 'center' });
            // Agregar la fecha y hora exacta de generación del reporte
            doc.fontSize(12);
            const fechaActual = moment().tz('America/Bogota').format('YYYY-MM-DD h:mm:ss A');
            doc.text('Fecha de generación de reporte: ' + fechaActual, 10, 20);
            // Leer la imagen
            const img = fs.readFileSync('public/img/icon.png');

            // Incrustar la imagen en el PDF  
            doc.image(img, { width: 200 });

            // Cambiar la posición 'y' después de incrustar la imagen
            let y = doc.y + 20;

            // Definir la tabla y sus columnas
            const headers = ['Numero ', 'Precio','Detalle' ];

            // Dibujar la tabla
            doc.fontSize(12);
            doc.font('Helvetica-Bold');
            headers.forEach((header, i) => {
                doc.text(header, 10 + i * 100, y);
            });

            // Dibujar los datos de la tabla
            doc.font('Helvetica');
            y += 25;
            userData.forEach(user => {
                doc.text(user.NUMERO_HABITACION, 10, y);
                doc.text(user.PRECIO, 110, y);
                doc.text(user.DETALLE, 190, y);
                
                y += 25;
            });
            // Finalizar el PDF
            doc.end();
        } else if (formato === 'excel') {
            // Crear un nuevo libro de Excel
            const workbook = new excel.Workbook();
            const worksheet = workbook.addWorksheet('Usuarios');

            // Agregar encabezados de columna
            worksheet.columns = [
                { header: 'Precio', key: 'precio', width: 20 },
                { header: 'ID', key: 'numero_habitacion', width: 10 },
            ];

            // Agregar filas con datos
            userData.forEach((usuarios) => {
                worksheet.addRow({
                    precio: usuarios.PRECIO,
                    numero_habitacion: usuarios.NUMERO_HABITACION
                });
            });

            // Stream el contenido Excel a la respuesta HTTP
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=habitaciones.xlsx');
            await workbook.xlsx.write(res);

            // Finalizar la escritura del libro de Excel
            res.end();
        } else {
            res.status(400).send('Formato no válido. Por favor, elija entre "pdf" o "excel".');
        }
    } catch (error) {
        // Manejar errores de solicitud o cualquier otro error
        console.error(error);
        res.status(500).send('Error al generar el archivo');
    }
};

export const habitacionesController = {
    habitaciones, guardarh, borrarh, salir, edithabi, guardarhh, generarpdfhabi
}