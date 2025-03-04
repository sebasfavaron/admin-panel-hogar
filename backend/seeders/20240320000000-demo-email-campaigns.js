'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get some collaborators' IDs for recipients
    const collaborators = await queryInterface.sequelize.query(
      'SELECT id, email FROM "Collaborators";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!collaborators.length) {
      console.log(
        'No collaborators found. Please run collaborators seed first.'
      );
      return;
    }

    // Check if campaigns already exist
    const existingCampaigns = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM "EmailCampaigns";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingCampaigns[0].count > 0) {
      console.log('Email campaigns already seeded, skipping...');
      return;
    }

    // Create demo campaigns
    const campaigns = [
      {
        id: uuidv4(),
        subject: 'Monthly Update - March 2024',
        body: `<h1>Monthly Orphanage Update</h1>
        <p>Dear supporter,</p>
        <p>Thank you for your continued support of our orphanage. Here's what we've been up to this month...</p>
        <p>Best regards,<br>The Orphanage Team</p>`,
        status: 'draft',
        recipient_count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        subject: 'Thank You for Your Support',
        body: `<h1>Thank You!</h1>
        <p>Dear valued supporter,</p>
        <p>We wanted to take a moment to thank you for your generous contributions...</p>
        <p>Warm regards,<br>The Orphanage Team</p>`,
        status: 'sent',
        sent_at: new Date(2024, 2, 1),
        recipient_count: 3,
        createdAt: new Date(2024, 2, 1),
        updatedAt: new Date(2024, 2, 1),
      },
    ];

    // Insert campaigns
    await queryInterface.bulkInsert('EmailCampaigns', campaigns);

    // Add recipients for the sent campaign
    const sentCampaign = campaigns.find((c) => c.status === 'sent');
    if (sentCampaign) {
      const recipients = collaborators.slice(0, 3).map((collaborator) => ({
        id: uuidv4(),
        EmailCampaignId: sentCampaign.id,
        CollaboratorId: collaborator.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert('CampaignRecipients', recipients);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CampaignRecipients', null, {});
    await queryInterface.bulkDelete('EmailCampaigns', null, {});
  },
};
