
// mainController.js
import jwt from 'jsonwebtoken';
import axios from 'axios';


export const renderHabitaciones = async (req, res) => {
  try {
    const response = await axios.get(process.env.API + 'habitacion');
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

export const renderReserva = async (req, res) => {
  // Ruta a la API de habitaciones
  let ruta = process.env.API + 'habitacion';
  let rutaMetodosPago = process.env.API + 'metodopago'; 

  let option = {
      method: "GET",
  }

  // Obteniendo habitaciones de la API
  let habitaciones = [];
  let datosMetodosPago = [];
  const result = await fetch(ruta, option)
      .then(response => response.json())
      .then(data => {
          habitaciones = data[0];
      })
      .catch(err => console.error("error en peticion" + err))


      await fetch(rutaMetodosPago, option)
      .then(response => response.json())
      .then(data => {
        datosMetodosPago = data[0]  // Asume que los datos vienen como un array de objetos
      })
      .catch(err => console.error("error en peticion" + err))
  // Filtrando las habitaciones inactivas
  let habitacionesActivas = habitaciones.filter(habitacion => habitacion.estado !== 2);

  res.render('reserva.ejs', { 
      userName: getUserName(req.cookies.authToken),
      habitaciones: habitacionesActivas ,
      "datosMetodosPago": datosMetodosPago,
    
  });
};

// controllers/whatsappController.js

export const sendWhatsAppMessage = (req, res) => {
  const { cliente, fechainicio, fechafin, hora, personas, servicio } = req.body;

  if (!cliente || !fechainicio || !hora) {
    res.status(400).json({ message: `Faltan algunos datos, ${cliente}` });
    return;
  }

  const telefono = "573005255034";
  const url = `https://api.whatsapp.com/send?phone=${telefono}&text=
    *HOTELERIA Y TURISMO*%0A%0A
    *HOLA quiero realizar una reservacion*%0A%0A
    *Nombre*%0A
    ${cliente}%0A
    *Fecha de reserva*%0A
    ${fechainicio}%0A
    *Hasta*%0A
    ${fechafin}%0A%0A
    *Hora de la reserva*%0A
    ${hora}%0A
    *Cantidad de personas*%0A
    ${personas}%0A
    *Cual cabaña desea*%0A
    ${servicio}`;

  res.status(200).json({ message: `Se ha enviado tu reserva, ${cliente}`, url });
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
