// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// Importar modelos
const Usuario = require('./models/usuario')(sequelize);
const Caso = require('./models/caso')(sequelize);
const Asignacion = require('./models/asignacion')(sequelize);

// Establecer asociaciones
Usuario.hasMany(Caso, { foreignKey: 'Usuario_id' });
Caso.belongsTo(Usuario, { foreignKey: 'Usuario_id' });

Usuario.belongsToMany(Caso, {
  through: Asignacion,
  foreignKey: 'Usuario_id',
  otherKey: 'Caso_id',
});
Caso.belongsToMany(Usuario, {
  through: Asignacion,
  foreignKey: 'Caso_id',
  otherKey: 'Usuario_id',
});

module.exports = {
  sequelize,
  Usuario,
  Caso,
  Asignacion,
};
