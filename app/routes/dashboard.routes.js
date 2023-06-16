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
        try {
            const token = jwt.verify(
                req.cookies.ckmp,
                process.env.SECRET_KEY
            )

            let ruta = "http://localhost:3000/api/user";
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
                "datos": datos
            });

        } catch (error) {
            res.redirect("/");
        }
    } else {
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

dash.post("/guardar", (req, res) => {
    let metodo ="post";
    let ruta = "http://localhost:3000/api/user";
    if (req.body.name) {

        let data = {
            name: req.body.name
        }

         

        if(req.body.id){
            data= {
                id: req.body.id,
                name: req.body.name
            }
            metodo = "put";

        }


        
       

        let options = {

            method: metodo,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
        try {
            const result = fetch(ruta, options)
                .then(res => res.json())
                .then(data => {
                    console.log("Datos guardados exitosamente ");
                })
                .catch(error => console.log('error consumo de api'));
            res.redirect("/v1/usuario")
        } catch (error) {

        }

    } else {
        res.send("error");
    }
})
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