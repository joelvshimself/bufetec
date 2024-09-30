// app.js
require('dotenv').config();
const express = require('express');
const { sequelize, Usuario, Caso, Asignacion } = require('./db');

const app = express();
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

app.get('/casos', async (req, res) => {
  try {
    const casos = await Caso.findAll({ include: Usuario });
    res.json(casos);
  } catch (error) {
    res.status(500).json({ error: error.message });
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