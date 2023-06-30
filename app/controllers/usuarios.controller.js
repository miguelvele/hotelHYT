import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"

const usuario = async (req, res) => {
    
        
        try {
            // process.env.API + 'pro' + `/${id}`;

            let ruta = process.env.API + 'usuarios';
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
                "menu": 1,
                "datos": datos,
            });

        } catch (error) {
            res.redirect("/");
        }
    
};

const guardaru = async(req, res) => {
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

    axios.post('http://localhost:3000/api/usuarios', nuevoUsuario)
        .then(response => {
            console.log(response.data);
            // Aquí puedes realizar alguna acción adicional o mostrar un mensaje de éxito.
            res.redirect("/v1/usuario");
        })
        .catch(error => {
            console.error(error);
            // Aquí puedes manejar el error de alguna manera o mostrar un mensaje de error.
            res.redirect('/error'); // Redirige a una página de error o a donde desees.
        });
};


const borrar = async (req, res) =>{
    const id = req.query.id;


        try {
            

                const url = `http://localhost:3000/api/usuarios/${id}`;
                const option={
                    method:"DELETE"
                };
                const result = await fetch(url, option)
                .then((response) => response.json())
                .then((data) => {
                  if (data[0].affectedRows == 1) {
                    res.redirect(`/v1/usuario?success=true&id=${id}`);
                  } else {
                    console.log("No se pudo borrar mi bro");
                    res.redirect(`/v1/usuario?success=false&id=${id}`);
                  }
                });
            } catch (error) {
              console.error("Error con el token", error);
              res.redirect(`/v1/usuario?success=false&id=${id}`);
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
const edituser = async(req, res)=>{
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
        id:id,
        codigo_usuario:codigo_usuario,
        codigo_tipo_usuario:codigo_tipo_usuario,
        tipo_documento:tipo_documento,
        documento:documento,
        nombre:nombre,
        apellido:apellido,
        correo:correo,
        clave:clave,
        estado:estado,
        fecha_creacion:fecha_creacion

        
    }

    
        try {
            
                res.render("dash", {
                    
            
                    "menu" : 4,
                    "datos" : datos
                 });

        } catch (error) {
            console.error("Errro con el token");
        }
    
}
const guardar = async(req, res)=>{
    
           let data = {
                id:req.query.id,
                codigo_usuario:req.query.codigo_usuario,
                codigo_tipo_usuario:req.query.codigo_tipo_usuario,
                tipo_documento:req.query.tipo_documento,
                documento:req.query.documento,
                nombre:req.query.nombre,
                apellido:req.query.apellido,
                correo:req.query.correo,
                clave:req.query.clave,
                estado:req.query.estado,
                fecha_creacion:req.query.fecha_creacion,
            }
            let metodo = "put";
        


        let ruta = `http://localhost:3000/api/usuarios`;

        let option = {
            method : metodo,
            headers:{
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data)
        }
        try {
            const result = await fetch(ruta, option)
            .then(res=>res.json())
            .then(data=>{
                console.log("Datos guardados");
            })
            .catch(err=>console.log("erro al consumir api " + err))
            res.redirect("/v1/usuario");
        } catch (error) {
            
        }

    
}

const generarpdf = async (req, res) => {
    try {
        const formato = req.body.formato; // Obtener el parámetro "formato" de la solicitud POST

        // Hacer una solicitud GET a la API para obtener la información
        const response = await axios.get('http://localhost:3000/api/usuarios');
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
            doc.fontSize(20).text('Información del Usuario', { align: 'center' });
            // Leer la imagen
            const img = fs.readFileSync('public/img/icon.png');

            // Incrustar la imagen en el PDF  
            doc.image(img, { width: 200 });
            userData.forEach((usuarios) => {
                doc.fontSize(12).text(`ID: ${usuarios.CODIGO_USUARIO}`);
                doc.fontSize(12).text(`Documento: ${usuarios.DOCUMENTO}`);
                doc.fontSize(12).text(`Nombre: ${usuarios.NOMBRE}`);
                doc.fontSize(12).text(`Apellido: ${usuarios.APELLIDO}`);
                doc.fontSize(12).text(`Correo: ${usuarios.CORREO}`);



                doc.moveDown(); // Agrega un espacio entre cada usuario
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
                worksheet.addRow({ nombre: usuarios.NOMBRE,
                     codigo_usuario: usuarios.CODIGO_USUARIO });
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


export const usuarioController = {
 usuario, guardaru , borrar, salir, actualizar, generarpdf, edituser, guardar
};