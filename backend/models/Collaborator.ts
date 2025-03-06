import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define attributes interface
export interface CollaboratorAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string;
  help_type: 'financial' | 'physical' | 'both';
  last_contact?: Date;
  address?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define creation attributes interface (optional fields during creation)
export interface CollaboratorCreationAttributes
  extends Optional<CollaboratorAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Collaborator class
class Collaborator
  extends Model<CollaboratorAttributes, CollaboratorCreationAttributes>
  implements CollaboratorAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public help_type!: 'financial' | 'physical' | 'both';
  public last_contact!: Date;
  public address!: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public static associate(models: any): void {
    // Will be defined in associations.ts
  }
}

Collaborator.init(
  {
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
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    help_type: {
      type: DataTypes.ENUM('financial', 'physical', 'both'),
      allowNull: false,
    },
    last_contact: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Collaborator',
    tableName: 'Collaborators',
  }
);

export default Collaborator;
