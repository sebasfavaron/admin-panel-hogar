import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface CollaboratorAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string;
  help_type: 'financial' | 'physical' | 'both';
  last_contact?: Date;
  address?: object;
}

class Collaborator
  extends Model<CollaboratorAttributes>
  implements CollaboratorAttributes
{
  public id!: string;
  public name!: string;
  public email!: string;
  public phone!: string;
  public help_type!: 'financial' | 'physical' | 'both';
  public last_contact!: Date;
  public address!: object;
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
  },
  {
    sequelize,
    modelName: 'Collaborator',
    timestamps: true,
  }
);

export default Collaborator;
