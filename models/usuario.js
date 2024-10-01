// models/Usuario.js
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
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    Contrasena: {
      type: DataTypes.STRING,
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
  }, {
    tableName: 'Usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        const salt = await bcrypt.genSalt(10);
        usuario.Contrasena = await bcrypt.hash(usuario.Contrasena, salt);
      },
    },
  });

  // Método para validar la contraseña
  Usuario.prototype.validarContrasena = async function (contrasena) {
    return await bcrypt.compare(contrasena, this.Contrasena);
  };

  return Usuario;
};
