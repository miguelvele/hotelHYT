// Importación de módulos necesarios
import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs";
import PDFDocument from "pdfkit";
import axios from "axios";
import fs from "fs";

// Función para obtener datos de las habitaciones
const getRoomData = async () => {
  try {
    // Realizar una petición GET a la API para obtener datos de habitaciones
    const response = await axios.get(process.env.API + "habitacion");
    const data = response.data[0];
    let roomCount = {
      limpieza: 0,
      disponibles: 0,
      ocupadas: 0,
    };

    // Contar habitaciones por estado
    data.forEach((room) => {
      if (room.CODIGO_ESTADO_HABITACION === 1) {
        roomCount.ocupadas++;
      } else if (room.CODIGO_ESTADO_HABITACION === 2) {
        roomCount.disponibles++;
      } else if (room.CODIGO_ESTADO_HABITACION === 3) {
        roomCount.limpieza++;
      }
    });

    // Retornar el conteo de habitaciones
    return roomCount;
  } catch (error) {
    console.error("Error fetching room data:", error);
    return null;
  }
};

// Controlador para cargar la página de inicio
const inicio = async (req, res) => {
  try {
    // Obtener datos de habitaciones
    const roomData = await getRoomData();

    // Renderizar la vista 'dash' con los datos de las habitaciones
    res.render("dash", {
      name: req.user.name,
      menu: 0,
      roomData,
    });
  } catch (error) {
    // Redirigir al inicio en caso de error
    res.redirect("/");
  }
};

// Exportar el controlador
export const inicioController = {
  inicio,
};

