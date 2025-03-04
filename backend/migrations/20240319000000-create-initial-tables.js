'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Create Collaborators table
    await queryInterface.createTable('Collaborators', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
      },
      help_type: {
        type: DataTypes.ENUM('financial', 'physical', 'both'),
        allowNull: false,
      },
      last_contact: {
        type: DataTypes.DATE,
      },
      address: {
        type: DataTypes.JSONB,
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

    // Create Donations table
    await queryInterface.createTable('Donations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      CollaboratorId: {
        type: DataTypes.UUID,
        references: {
          model: 'Collaborators',
          key: 'id',
        },
        onDelete: 'CASCADE',
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

    // Create EmailCampaigns table
    await queryInterface.createTable('EmailCampaigns', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      sent_at: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM('draft', 'sent'),
        defaultValue: 'draft',
        allowNull: false,
      },
      recipient_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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

    // Create CampaignRecipients junction table
    await queryInterface.createTable('CampaignRecipients', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      EmailCampaignId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'EmailCampaigns',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      CollaboratorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Collaborators',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    await queryInterface.addIndex('Collaborators', ['email']);
    await queryInterface.addIndex('Collaborators', ['help_type']);
    await queryInterface.addIndex('Donations', ['CollaboratorId']);
    await queryInterface.addIndex('EmailCampaigns', ['status']);
    await queryInterface.addIndex('EmailCampaigns', ['sent_at']);
    await queryInterface.addIndex('CampaignRecipients', ['EmailCampaignId']);
    await queryInterface.addIndex('CampaignRecipients', ['CollaboratorId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('CampaignRecipients');
    await queryInterface.dropTable('Donations');
    await queryInterface.dropTable('EmailCampaigns');
    await queryInterface.dropTable('Collaborators');
  },
};
