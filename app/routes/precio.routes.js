import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from 'path';

import excel from "exceljs"
import PDFDocument from "pdfkit"
import axios from "axios";
import fs from "fs"
import { precioController} from "../controllers/precio.controller.js";



dotenv.config();

const router = Router();

router.get('/precio', precioController.precio);






export default router;