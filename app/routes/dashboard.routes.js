import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"


dotenv.config();

const dash = Router();




// Ruta vista inicio
dash.get("/inicio", (req, res) => {
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
});

// Ruta vista usuarios
dash.get("/usuario", async (req, res) => {
    if (req.cookies.ckmp) {
        // try {
        //     const token = jwt.verify(
        //         req.cookies.ckmp,
        //         process.env.SECRET_KEY
        //     )

        //     let tipou = "http://localhost:3000/api/http://localhost:3000/api/tiposusuario";
        //     let option = {
        //         method: "GET",
        //     }
        //     let tipos = {};
        //     const result = await fetch(tipou, option)
        //         .then(response => response.json())
        //         .then(data => {
        //             tipos = data[0]
        //             //console.log(data[0]);
        //         })
        //         .catch(err => console.error("error en peticion" + err))

        //     } catch (error) {
        //         res.redirect("/");
        //     }

        try {
            const token = jwt.verify(
                req.cookies.ckmp,
                process.env.SECRET_KEY
            )

            let ruta = "http://localhost:3000/api/usuarios";
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
                "menu": 1,
                "datos": datos,
            });

        } catch (error) {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

dash.get("/tiposusuario", async (req, res) => {
    try {
        const tiposusuarioResponse = await fetch('http://localhost:3000/api/tiposusuario');
        const tiposusuario = await tiposusuarioResponse.json();
    
        res.render("tiposusuario", {
          tiposusuario: tiposusuario
        });
      } catch (error) {
        console.error('Error en la petición a la API de tipos de usuario:', error);
        res.redirect("/");
      }
});

dash.post("/generarpdf", async (req, res) => {
    try {
      const formato = req.body.formato; // Obtener el parámetro "formato" de la solicitud POST
  
      // Hacer una solicitud GET a la API para obtener la información
      const response = await axios.get('http://localhost:3000/api/user');
      const userData = response.data[0]; // Obtener el primer elemento del arreglo
  
      // Mostrar información por consola
      console.log('Información del Usuario:');
      
      userData.forEach((user) => {
        console.log(`Nombre: ${user.NAME}`);
        console.log(`ID: ${user.ID}`);
      });
  
      if (formato === 'pdf') {
        // Crear un nuevo documento PDF
        const doc = new PDFDocument();
  
        // Stream el contenido PDF a la respuesta HTTP
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=user.pdf');
        doc.pipe(res);
  
        // Agregar contenido al PDF
        doc.fontSize(18).text('Información del Usuario', { align: 'center' });
         // Leer la imagen
      const img = fs.readFileSync('public/img/icon.png');
     
      // Incrustar la imagen en el PDF  
      doc.image(img, {width: 200}); 
        userData.forEach((user) => {
          doc.fontSize(12).text(`Nombre: ${user.NAME}`);
          doc.fontSize(12).text(`ID: ${user.ID}`);
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
          { header: 'Nombre', key: 'name', width: 20 },
          { header: 'ID', key: 'id', width: 10 },
        ];
  
        // Agregar filas con datos
        userData.forEach((user) => {
          worksheet.addRow({ name: user.NAME, id: user.ID });
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
  });


// Ruta para ver productos
dash.get("/producto", (req, res) => {
    if (req.cookies.ckmp) {
        try {
            const token = jwt.verify(req.cookies.ckmp, process.env.SECRET_KEY);

            res.render("dash", {
                "nombre": token.nombre,
                "foto": token.foto,
                "menu": 2
            });

        } catch (error) {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

// Ruta para ver categorias
dash.get("/categoria", (req, res) => {
    if (req.cookies.ckmp) {
        try {
            const token = jwt.verify(req.cookies.ckmp, process.env.SECRET_KEY);

            res.render("dash", {
                "nombre": token.nombre,
                "foto": token.foto,
                "menu": 3
            });

        } catch (error) {
            res.redirect("/");
        }
    } else {
        res.redirect("/");
    }
});

dash.post('/guardar', (req, res) => {
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
        res.redirect("/v1/usuario");      })
      .catch(error => {
        console.error(error);
        // Aquí puedes manejar el error de alguna manera o mostrar un mensaje de error.
        res.redirect('/error'); // Redirige a una página de error o a donde desees.
      });
  });
  
// Ruta para salir del dash
dash.get("/salir", (req, res) => {
    res.clearCookie("ckmp");
    res.redirect("/");
});

dash.get("/edit-user", (req, res) => {
    const id = req.query.id;
    const name = req.query.name;

    let datos = {
        id: id,
        name: name
    }

    if (req.cookies.ckmp) {
        try {
            const token = jwt.verify(
                req.cookies.ckmp,
                process.env.SECRET_KEY)
            res.render("dash", {
                "nombre": token.nombre,
                "foto": token.foto,
                "menu": 4,
                "datos": datos
            });

        } catch (error) {
            console.error("error con el token")
        }
    }


})

export default dash;