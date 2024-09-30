// models/Usuario.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    Usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Correo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    Permisos: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    Telefono: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    Edad: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  }, {
    tableName: 'Usuarios',
    timestamps: false,
  });

  return Usuario;
};
