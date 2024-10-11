// mensaje.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Mensaje = sequelize.define('Mensaje', {
    Mensaje_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Contenido: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    FechaEnvio: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    Remitente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Destinatario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'Mensajes',
    timestamps: false,
  });

  return Mensaje;
};
