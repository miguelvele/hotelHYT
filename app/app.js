import express from 'express';
import dotenv from 'dotenv';
import { loginRouter } from './routes/login.routes.js';
import passport from 'passport';
import './middlewares/google.js';
import ejs from 'ejs';
import path from 'path';
import * as url from 'url';
import route from "./routes/home.routes.js"
import inicio from './routes/dashboard.routes.js';
import usuario from './routes/usuarios.routes.js';
import habitaciones from './routes/habitaciones.routes.js';
import reservaciones from './routes/reservaciones.routes.js';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Por si __dirname no funciona
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.set("views", path.join(__dirname, "views"));

// Asignacion de plantilla ejs
app.set("view engine", "ejs");

// MIDDLEWARES
app.use(express.json());
app.use(passport.initialize());
app.use(express.static(__dirname + '../public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));

// TODAS LAS RUTAS Y PERMISOS DE GOOGLE
app.use("/auth", passport.authenticate("auth-google", {
    scope: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
    ],
    session: false
}), loginRouter);

app.use("/", route);
app.use("/v1", inicio);
app.use("/v1", usuario);
app.use("/v1", habitaciones);
app.use("/v1", reservaciones);


// SE CAPTURA EL PUERTO QUE SE ENVUENTRA EN LOS AMBIENTES
app.set("port", process.env.PORT || 9999);

// ESTO SE VE EN LA RUTA PRINCIPAL
// app.get("/", (req, res) => {
//     res.send("Hola, Bienvenido");
// });

export default app;