// models/Asignacion.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Asignacion = sequelize.define('Asignacion', {
    Usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    Caso_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    tableName: 'Asignaciones',
    timestamps: false,
  });

  // Definir las relaciones con Usuario y Caso
  Asignacion.associate = (models) => {
    Asignacion.belongsTo(models.Usuario, { foreignKey: 'Usuario_id' });
    Asignacion.belongsTo(models.Caso, { foreignKey: 'Caso_id' });
  };

  return Asignacion;
};
