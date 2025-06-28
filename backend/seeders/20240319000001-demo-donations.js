const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all collaborators' IDs and emails for reference
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

    // Check if donations already exist
    const existingDonations = await queryInterface.sequelize.query(
      'SELECT COUNT(*) as count FROM "Donations";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingDonations[0].count > 0) {
      console.log('Donations already seeded, skipping...');
      return;
    }

    const testDonations = [
      {
        amount: 1000.0,
        currency: 'USD',
        date: new Date(2024, 0, 15),
        payment_method: 'Credit Card',
        collaboratorEmail: 'john@example.com',
      },
      {
        amount: 500.0,
        currency: 'USD',
        date: new Date(2024, 1, 1),
        payment_method: 'Bank Transfer',
        collaboratorEmail: 'jane@example.com',
      },
      {
        amount: 250.0,
        currency: 'EUR',
        date: new Date(2024, 2, 1),
        payment_method: 'PayPal',
        collaboratorEmail: 'bob@example.com',
      },
    ];

    const donations = testDonations
      .map((donation) => {
        const collaborator = collaborators.find(
          (c) => c.email === donation.collaboratorEmail
        );
        if (!collaborator) {
          console.log(
            `No collaborator found for email: ${donation.collaboratorEmail}`
          );
          return null;
        }

        return {
          id: uuidv4(),
          amount: donation.amount,
          currency: donation.currency,
          date: donation.date,
          payment_method: donation.payment_method,
          collaboratorId: collaborator.id, // Updated to match Sequelize's convention
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
      .filter(Boolean);

    if (donations.length > 0) {
      return queryInterface.bulkInsert('Donations', donations);
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Donations', null, {});
  },
};
