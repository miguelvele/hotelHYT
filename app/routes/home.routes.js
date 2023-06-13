import { Router } from "express";

const route = Router();

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