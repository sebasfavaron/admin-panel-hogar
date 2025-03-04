import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface DonationAttributes {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  payment_method: string;
  CollaboratorId: string; // Updated to match Sequelize's convention
}

class Donation extends Model<DonationAttributes> implements DonationAttributes {
  public id!: string;
  public amount!: number;
  public currency!: string;
  public date!: Date;
  public payment_method!: string;
  public CollaboratorId!: string; // Updated to match Sequelize's convention
}

Donation.init(
  {
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
      // Updated to match Sequelize's convention
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Donation',
    timestamps: true,
  }
);

export default Donation;
