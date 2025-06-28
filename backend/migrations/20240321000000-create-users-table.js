'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    try {
      // Check if table exists first
      const tableExists = await queryInterface
        .showAllTables()
        .then((tables) => tables.includes('Users'));

      if (!tableExists) {
        await queryInterface.createTable('Users', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
          },
          email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          lastLogin: {
            type: DataTypes.DATE,
          },
          createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
          },
        });

        // Add indexes for better performance
        await queryInterface.addIndex('Users', ['email']);
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  },
};
