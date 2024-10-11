// app.js
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const app = express();
app.use(cors());

const { sequelize, Usuario, Caso, Asignacion } = require('./db');

const port = process.env.PORT || 3000;
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos exitosa.');

    await sequelize.sync();
    console.log('Modelos sincronizados correctamente.');

    // Mantenemos app.listen aquí
    app.listen(port, () => {
      console.log(`Aplicación escuchando en http://localhost:${port}`);

    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
})();



// Rutas para Usuarios
app.post('/usuarios', async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para autenticación
app.post('/login', async (req, res) => {
  const { Correo, Password } = req.body;

  try {
    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ where: { Correo } });

    // Verificar si el usuario existe
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const esValida = await bcrypt.compare(Password, usuario.Password);

    // Retornar un booleano
    if (esValida) {
      res.json({ success: true, message: 'Autenticación exitosa' });
    } else {
      res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error durante la autenticación:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Ruta de Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ mensaje: 'todo bien humano' });
  });

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas para Casos
app.post('/casos', async (req, res) => {
  try {
    const nuevoCaso = await Caso.create(req.body);
    res.status(201).json(nuevoCaso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Crear una caso en base al email del usuario y al estatus
app.post('/casos/:email', async (req, res) => {
  const { email } = req.params;
  const { Status } = req.body; // Asegúrate de que 'Status' viene en el cuerpo de la solicitud

  try {
    // Buscar el usuario por correo electrónico
    const usuario = await Usuario.findOne({ where: { Correo: email } });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear un nuevo caso asociado al usuario
    const nuevoCaso = await Caso.create({
      Usuario_id: usuario.Usuario_id,
      Status, // Asegúrate de que 'Status' es un campo válido en el modelo
    });

    res.status(201).json(nuevoCaso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




app.get('/casos', async (req, res) => {
  try {
    const casos = await Caso.findAll({ include: Usuario });
    res.json(casos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta PUT para actualizar el Status de un Caso y establecerlo en 1
app.put('/casos/:id', async (req, res) => {
  const { id } = req.params; // Obtenemos el Caso_id de los parámetros de la URL

  try {
    // Buscamos el caso por su ID
    const caso = await Caso.findByPk(id);

    if (!caso) {
      return res.status(404).json({ message: 'Caso no encontrado' });
    }

    // Establecemos el Status en 1
    caso.Status = 1;

    // Guardamos los cambios en la base de datos
    await caso.save();

    // Devolvemos el caso actualizado
    res.status(200).json(caso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para borrar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al borrar usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para editar el permiso de un usuario
app.put('/api/usuarios/:id/permisos', async (req, res) => {
  const { id } = req.params;
  const { Permisos } = req.body;

  // Validar que el permiso sea un número entero
  if (!Number.isInteger(Permisos)) {
    return res.status(400).json({ message: 'Permiso debe ser un número entero' });
  }

  try {
    // Buscar al usuario por su ID en la base de datos
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el permiso del usuario
    usuario.Permisos = Permisos; // Asumiendo que el campo en la base de datos se llama 'permiso'

    await usuario.save();
    res.json({ message: 'Permiso actualizado correctamente', usuario });
  } catch (error) {
    console.error('Error al actualizar permiso:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});





// Rutas para Asignaciones
app.post('/asignaciones', async (req, res) => {
  try {
    const nuevaAsignacion = await Asignacion.create(req.body);
    res.status(201).json(nuevaAsignacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/asignaciones', async (req, res) => {
  try {
    const asignaciones = await Asignacion.findAll({
      include: [Usuario, Caso],
    });
    res.json(asignaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
