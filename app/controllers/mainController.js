
// mainController.js
import jwt from 'jsonwebtoken';
import axios from 'axios';


export const renderHabitaciones = async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/api/habitacion');
    const habitaciones = response.data;
    res.render('index', { userName: getUserName(req.cookies.authToken), habitaciones });
  } catch (error) {
    console.error('Error al obtener las habitaciones:', error);
    res.render('index', {
       userName: getUserName(req.cookies.authToken), habitaciones: [] });
  }
};
export const renderImagenes = (req, res) => {
  res.render('imagenes.ejs', { userName: getUserName(req.cookies.authToken) });
};

export const renderServicios = (req, res) => {
  res.render('servicios.ejs', { userName: getUserName(req.cookies.authToken) });
};

export const renderContactenos = (req, res) => {
  res.render('contactenos.ejs', { userName: getUserName(req.cookies.authToken) });
};


export const renderLogin = (req, res) => {
  res.render('login.ejs', { userName: getUserName(req.cookies.authToken) });
};

export const renderRegistro = (req, res) => {
  res.render('registro.ejs', { userName: getUserName(req.cookies.authToken) });
};

export const renderReserva = (req, res) => {
  res.render('reserva.ejs', { userName: getUserName(req.cookies.authToken) });
};


export function getUserName(authToken) {
  if (!authToken) return null;

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    return decodedToken.name;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
