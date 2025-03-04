const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const testCollaborators = [
      {
        email: 'john@example.com',
        name: 'John Doe',
        phone: '+1234567890',
        help_type: 'financial',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          zipCode: '62701',
        },
      },
      {
        email: 'jane@example.com',
        name: 'Jane Smith',
        phone: '+1987654321',
        help_type: 'physical',
        address: {
          street: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          zipCode: '62702',
        },
      },
      {
        email: 'bob@example.com',
        name: 'Bob Wilson',
        phone: '+1122334455',
        help_type: 'both',
        address: {
          street: '789 Pine St',
          city: 'Springfield',
          state: 'IL',
          country: 'USA',
          zipCode: '62703',
        },
      },
    ];

    // For each test collaborator, try to find or create it
    for (const collaborator of testCollaborators) {
      const [existing] = await queryInterface.sequelize.query(
        'SELECT id FROM "Collaborators" WHERE email = ?',
        {
          replacements: [collaborator.email],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('Collaborators', [
          {
            id: uuidv4(),
            ...collaborator,
            address: JSON.stringify(collaborator.address),
            last_contact: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Collaborators', null, {});
  },
};
