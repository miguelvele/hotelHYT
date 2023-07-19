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

const reservaciones = async (req, res) => {
  try {
    let rutaReservas = process.env.API + 'reservas';
    let rutaUsuarios = process.env.API + 'usuarios'; 
    let rutaMetodosPago = process.env.API + 'metodopago'; // Asume que esta es la ruta para obtener los métodos de pago
    let option = {
      method: "GET",
    }
    let datosReservas = {};
    let datosUsuarios = {};
    let datosMetodosPago = {};

    await fetch(rutaReservas, option)
      .then(response => response.json())
      .then(data => {
        datosReservas = data[0]
      })
      .catch(err => console.error("error en peticion" + err))

    await fetch(rutaUsuarios, option)
      .then(response => response.json())
      .then(data => {
        datosUsuarios = data[0]
      })
      .catch(err => console.error("error en peticion" + err))

    await fetch(rutaMetodosPago, option)
      .then(response => response.json())
      .then(data => {
        datosMetodosPago = data[0]  // Asume que los datos vienen como un array de objetos
      })
      .catch(err => console.error("error en peticion" + err))

      let rutaHabitaciones = process.env.API + 'habitacion'; // Asume que esta es la ruta para obtener las habitaciones
      let datosHabitaciones = {};
      
      await fetch(rutaHabitaciones, option)
        .then(response => response.json())
        .then(data => {
          
          datosHabitaciones = data[0]  // Asume que los datos vienen como un array de objetos
        })
        .catch(err => console.error("error en peticion" + err))
      
    res.render("dash", {
      name: req.user.name,
      "menu": 3,
      "datosReservas": datosReservas,
      "datosUsuarios": datosUsuarios,
      "datosMetodosPago": datosMetodosPago,
      "datosHabitaciones": datosHabitaciones   // Datos de los métodos de pago
    });

  } catch (error) {
    res.redirect("/");
  }
};

const guardarr = async (req, res) => {
  const nuevaReservacion = {
    codigo_usuario: req.body.CODIGO_USUARIO,
    codigo_metodo_pago: req.body.CODIGO_METODO_PAGO,
    numero_habitacion: req.body.NUMERO_HABITACION,

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

  axios.post(process.env.API + 'reservas', nuevaReservacion)
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
    const url = process.env.API + 'reservas' + `/${id}`;
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


const editreserva = async (req, res) => {
  const id = req.query.id;
  const codigo_usuario = req.query.codigo_usuario;
  const codigo_metodo_pago = req.query.codigo_metodo_pago;
  const numero_habitacion = req.query.numero_habitacion;

  const fecha_entrada = req.query.fecha_entrada;
  const fecha_salida = req.query.fecha_salida;
  const precio_inicial = req.query.precio_inicial;
  const adelanto= req.query.adelanto;
  const precio_restante = req.query.precio_restante;
  const total_pagado = req.query.total_pagado;
  const costo_penalidad = req.query.costo_penalidad;
  const observaciones = req.query.observaciones;
  const estado = req.query.estado;

  let datos = {
    id: id,
    codigo_usuario: codigo_usuario,
    codigo_metodo_pago: codigo_metodo_pago,
    numero_habitacion: numero_habitacion,

    fecha_entrada: fecha_entrada,
    fecha_salida: fecha_salida,
    precio_inicial: precio_inicial,
    adelanto:adelanto,
    precio_restante: precio_restante,
    total_pagado: total_pagado,
    costo_penalidad: costo_penalidad,
    observaciones: observaciones,
    estado: estado,


  }


  try {

    res.render("dash", {
      name: req.user.name,


      "menu": 6,
      "datos": datos
    });

  } catch (error) {
    console.error("Errro con el token");
  }

}


const guardarre = async (req, res) => {

  let data = {
    id: req.body.id,
    codigo_usuario: req.body.codigo_usuario,
    codigo_metodo_pago: req.body.codigo_metodo_pago,
    numero_habitacion: req.body.numero_habitacion,

    fecha_entrada: req.body.fecha_entrada,
    fecha_salida: req.body.fecha_salida,
    precio_inicial: req.body.precio_inicial,
    adelanto:req.body.adelanto,
    precio_restante: req.body.precio_restante,
    total_pagado: req.body.total_pagado,
    costo_penalidad: req.body.costo_penalidad,
    observaciones: req.body.observaciones,
    estado: req.body.estado,
  }
  let metodo = "put";

  let ruta = process.env.API + 'reservas/' + req.body.id;

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
      res.redirect("/v1/reservaciones");
  } catch (error) {

  }
}


const generarpdfreser = async (req, res) => {
  try {
      const formato = req.body.formato; // Obtener el parámetro "formato" de la solicitud POST

      // Hacer una solicitud GET a la API para obtener la información
      const response = await axios.get(process.env.API + 'reservas');
      const userData = response.data[0]; // Obtener el primer elemento del arreglo

      // Mostrar información por consola
      console.log('Información del las habitaciones:');

      userData.forEach((usuarios) => {
          console.log(`Nombre: ${usuarios.CODIGO_RESERVA}`);
          
      });

      if (formato === 'pdf') {
          // Crear un nuevo documento PDF
          const doc = new PDFDocument();

          // Stream el contenido PDF a la respuesta HTTP
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=reservas.pdf');
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
          const headers = ['Numero ', 'Precio inicial','Total pagado' ];

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
              doc.text(user.CODIGO_RESERVA, 10, y);
              doc.text(user.PRECIO_INICIAL, 110, y);
              doc.text(user.TOTAL_PAGADO, 190, y);
              
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
export const reservacionesController = {
  reservaciones, guardarr, borrarr, salir, editreserva,guardarre , generarpdfreser
};