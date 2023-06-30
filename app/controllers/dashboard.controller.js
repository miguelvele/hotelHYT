import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"


const getRoomData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/habitacion");
    const data = response.data[0];
    let roomCount = {
      limpieza: 0,
      disponibles: 0,
      ocupadas: 0,
    };

    data.forEach((room) => {
      if (room.CODIGO_ESTADO_HABITACION === 1) {
        roomCount.ocupadas++;
      } else if (room.CODIGO_ESTADO_HABITACION === 2) {
        roomCount.disponibles++;
      } else if (room.CODIGO_ESTADO_HABITACION === 3) {
        roomCount.limpieza++;
      }
    });

    return roomCount;
  } catch (error) {
    console.error("Error fetching room data:", error);
    return null;
  }
};

const inicio = async (req, res) => {
  try {
    const roomData = await getRoomData();

    res.render("dash", {
      menu: 0,
      roomData,
    });
  } catch (error) {
    res.redirect("/");
  }
};

export const inicioController = {
  inicio,
};

