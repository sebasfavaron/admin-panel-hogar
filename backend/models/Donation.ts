import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define attributes interface
export interface DonationAttributes {
  id: string;
  amount: number;
  currency: string;
  date: Date;
  payment_method: string;
  collaboratorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes interface (optional fields during creation)
export interface DonationCreationAttributes
  extends Optional<DonationAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Donation class
class Donation
  extends Model<DonationAttributes, DonationCreationAttributes>
  implements DonationAttributes
{
  public id!: string;
  public amount!: number;
  public currency!: string;
  public date!: Date;
  public payment_method!: string;
  public collaboratorId!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(models: any): void {
    // Will be defined in associations.ts
  }
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
      defaultValue: 'USD',
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
    },
    collaboratorId: {
      type: DataTypes.UUID,
      references: {
        model: 'Collaborators',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  },
  {
    sequelize,
    modelName: 'Donation',
    tableName: 'Donations',
  }
);

export default Donation;
