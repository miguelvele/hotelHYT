import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import moment from 'moment-timezone';
import bodyParser from 'body-parser';
import fs from "fs"

const pisos = async (req, res) => {


    try {
        // process.env.API + 'pro' + `/${id}`;

        let ruta = process.env.API + 'pisos';
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
            "menu": 9,
            "datos": datos,
        });

    } catch (error) {
        res.redirect("/");
    }

};

const guardarpisos = async (req, res) => {
    const nuevoUsuario = {
        
        descripcion: req.body.DESCRIPCION,
        estado: req.body.ESTADO,
        fecha_creacion: req.body.FECHA_CREACION
    };

    axios.post(process.env.API + 'pisos', nuevoUsuario)
        .then(response => {
            console.log(response.data);
            // Aquí puedes realizar alguna acción adicional o mostrar un mensaje de éxito.
            res.redirect("/v1/pisos");
        })
        .catch(error => {
            console.error(error);
            // Aquí puedes manejar el error de alguna manera o mostrar un mensaje de error.
            res.redirect('/error'); // Redirige a una página de error o a donde desees.
        });
};


const borrarpiso = async (req, res) => {
    const id = req.query.id;


    try {


        const url = process.env.API + 'pisos' + `/${id}`;
        const option = {
            method: "DELETE"
        };
        const result = await fetch(url, option)
            .then((response) => response.json())
            .then((data) => {
                if (data[0].affectedRows == 1) {
                    res.redirect(`/v1/pisos?success=true&id=${id}`);
                } else {
                    console.log("No se pudo borrar mi bro");
                    res.redirect(`/v1/pisos?success=false&id=${id}`);
                }
            });
    } catch (error) {
        console.error("Error con el token", error);
        res.redirect(`/v1/pisos?success=false&id=${id}`);
    }

};

const salir = async (req, res) => {
    res.clearCookie("ckmp");
    res.redirect("/");
};


const actualizar = async (req, res) => {
    const formData = req.body;
    const apiUrl = 'http://localhost:3000/api/usuarios';

    // Realizar una petición PUT a la API para actualizar los datos del usuario
    axios.put(apiUrl, formData)
        .then(response => {
            console.log(response.data);
            res.send('Datos actualizados correctamente');
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('Error al actualizar los datos');
        });
};
const editpisos = async (req, res) => {
    const id = req.query.id;
    const descripcion = req.query.descripcion;
    const estado = req.query.estado;
    const fecha_creacion = req.query.fecha_creacion;

    let datos = {
        id: id,
        descripcion:descripcion,
        estado: estado,
        fecha_creacion: fecha_creacion


    }


    try {

        res.render("dash", {

            name: req.user.name,
            "menu": 14,
            "datos": datos
        });

    } catch (error) {
        console.error("Errro con el token");
    }

}
const guardarpiso = async (req, res) => {

    let data = {
        id: req.body.id,
       descripcion: req.body.descripcion,
        estado: req.body.estado,
        fecha_creacion: req.body.fecha_creacion,
    }
    let metodo = "put";

    let ruta = process.env.API + 'pisos/' + req.body.id;

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
        res.redirect("/v1/pisos");
    } catch (error) {

    }
}

const generarpdf = async (req, res) => {
    try {
        const formato = req.body.formato; // Obtener el parámetro "formato" de la solicitud POST

        // Hacer una solicitud GET a la API para obtener la información
        const response = await axios.get(process.env.API + 'usuarios');
        const userData = response.data[0]; // Obtener el primer elemento del arreglo

        // Mostrar información por consola
        console.log('Información del Usuario:');

        userData.forEach((usuarios) => {
            console.log(`Nombre: ${usuarios.NOMBRE}`);
            console.log(`ID: ${usuarios.CODIGO_USUARIO}`);
        });

        if (formato === 'pdf') {
            // Crear un nuevo documento PDF
            const doc = new PDFDocument();

            // Stream el contenido PDF a la respuesta HTTP
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=usuarios.pdf');
            doc.pipe(res);

            // Agregar contenido al PDF
            doc.fontSize(20).text('Información de los Usuario', { align: 'center' });
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
            const headers = ['ID', 'Documento', 'Nombre', 'Apellido', 'Correo'];

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
                doc.text(user.CODIGO_USUARIO, 10, y);
                doc.text(user.DOCUMENTO, 110, y);
                doc.text(user.NOMBRE, 210, y);
                doc.text(user.APELLIDO, 310, y);
                doc.text(user.CORREO, 410, y);
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
                { header: 'Nombre', key: 'nombre', width: 20 },
                { header: 'ID', key: 'codigo_usuario', width: 10 },
            ];

            // Agregar filas con datos
            userData.forEach((usuarios) => {
                worksheet.addRow({
                    nombre: usuarios.NOMBRE,
                    codigo_usuario: usuarios.CODIGO_USUARIO
                });
            });

            // Stream el contenido Excel a la respuesta HTTP
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=user.xlsx');
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


export const pisosController = {
    pisos, guardarpiso, borrarpiso, salir, actualizar, generarpdf, editpisos, guardarpisos
};