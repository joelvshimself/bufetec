// models/Caso.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Caso = sequelize.define('Caso', {
    Caso_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Status: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  }, {
    tableName: 'Casos',
    timestamps: false,
  });

  // Definir la relación con Usuario
  Caso.associate = (models) => {
    Caso.belongsTo(models.Usuario, { foreignKey: 'Usuario_id' });
  };

  return Caso;
};
