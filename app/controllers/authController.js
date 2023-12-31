import axios from 'axios';
import jwt from 'jsonwebtoken';


const loginUser = async (req, res) => {
  console.log('req.body:', req.body);
  const { correo, clave, tipoUsuario } = req.body;

  // Validación de campos vacíos
  if (correo === '' || clave === '' || tipoUsuario === '') {
    return res.json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const response = await axios.get(process.env.API +'usuarios');
    const usersData = response.data;
    const users = usersData[0];
    const user = users.find((u) => u.CORREO === correo);

    if (!user) {
      return res.json({ error: 'Usuario no encontrado' });
    }

    if (user.CLAVE !== clave) {
      return res.json({ error: 'Usuario o contraseña incorrecta' });
    }

    if (user.CODIGO_TIPO_USUARIO !== parseInt(tipoUsuario)) {
      return res.json({ error: 'No tiene permiso para acceder a este recurso' });
    }
    // Verificar el estado del usuario
    if (user.ESTADO === 2) {
      return res.json({ error: 'Usuario inactivo. Contacte al Hotel.' });
    }

    // Generación del token JWT
    const token = jwt.sign({ id: user.CODIGO_USUARIO, name: user.NOMBRE, type: user.CODIGO_TIPO_USUARIO }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    }); 

    // Envío del token en la cookie
    res.cookie('authToken', token, { httpOnly: true, secure: process.env.NODE_ENV !== 'development' });
    console.log('Token JWT:', token); // Agrega esta línea para depurar
    // Redireccionar según el tipo de usuario
    if (user.CODIGO_TIPO_USUARIO === 1) {
      res.json({ redirect: "/v1/inicio" });
    } else if (user.CODIGO_TIPO_USUARIO === 2) {
      res.json({ redirect: "/precio" });

    } else {
      res.status(400).json({ error: 'Tipo de usuario no reconocido' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos de usuarios', error: error.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('authToken');
  res.redirect('/');
};




export { loginUser};