import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, sequelize: Sequelize) {
    // Create Collaborators table
    await queryInterface.createTable('Collaborators', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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

    // Create EmailCampaigns table
    await queryInterface.createTable('EmailCampaigns', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.ENUM('draft', 'scheduled', 'sent'),
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

    // Create Donations table
    await queryInterface.createTable('Donations', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      date: {
        type: DataTypes.DATE,
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
        allowNull: false,
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

    // Create CampaignRecipients join table
    await queryInterface.createTable('CampaignRecipients', {
      campaignId: {
        type: DataTypes.UUID,
        references: {
          model: 'EmailCampaigns',
          key: 'id',
        },
        primaryKey: true,
      },
      collaboratorId: {
        type: DataTypes.UUID,
        references: {
          model: 'Collaborators',
          key: 'id',
        },
        primaryKey: true,
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
  },

  async down(queryInterface: QueryInterface, sequelize: Sequelize) {
    await queryInterface.dropTable('CampaignRecipients');
    await queryInterface.dropTable('Donations');
    await queryInterface.dropTable('EmailCampaigns');
    await queryInterface.dropTable('Collaborators');
  },
};
