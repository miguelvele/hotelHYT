import { Router } from "express";
import multer from 'multer';
import path from 'path';

const route = Router();

// Configuración de multer para guardar la imagen en la carpeta "public/img"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/img");
    },
    filename: function (req, file, cb) {
      // Genera un nombre único para la imagen
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  // Crea el middleware de multer utilizando la configuración anterior
  const upload = multer({ storage: storage });
  
  // Ruta para guardar la imagen
  route.post("/guardarimagen", upload.single("imagen"), (req, res) => {
    if (!req.file) {
      // No se proporcionó ninguna imagen en la solicitud
      return res.status(400).send("No se proporcionó ninguna imagen.");
    }
  
    // La imagen se ha guardado correctamente
    res.send("Imagen guardada correctamente.");
  });


route.get("/imagenes", (req, res) => {
    res.render("imagenes.ejs");
});

route.get("/servicios", (req, res) => {
    res.render("servicios.ejs");
});

route.get("/contactenos", (req, res) => {
    res.render("contactenos.ejs");
});

route.get("/", (req, res) => {
    res.render("index");
});

route.get("/precio", (req, res) => {
    res.render("precio.ejs");
});
route.get("/login", (req, res) => {
    res.render("login.ejs");
});
route.get("/registro", (req, res) => {
    res.render("registro.ejs");
});
route.get("/reserva", (req, res) => {
    res.render("reserva.ejs");
});

export default route;