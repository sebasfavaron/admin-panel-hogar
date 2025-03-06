const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if admin user already exists
    const [existingAdmin] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = ?',
      {
        replacements: ['admin@example.com'],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingAdmin) {
      console.log('Admin user already exists, skipping...');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    console.log('Admin user created successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', { email: 'admin@example.com' });
  },
};
