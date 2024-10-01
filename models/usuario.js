const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    Edad: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    // New password field
    Password: {
      type: DataTypes.STRING(60), // Set a maximum length of 60 for bcrypt hash
      allowNull: false,
    },
  }, {
    tableName: 'Usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.Password = await bcrypt.hash(usuario.Password, salt);
      },
    },
  });

  return Usuario;
};
