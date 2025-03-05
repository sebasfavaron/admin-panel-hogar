import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Collaborator from './Collaborator';

interface EmailCampaignAttributes {
  id: string;
  subject: string;
  body: string;
  sent_at?: Date;
  status: 'draft' | 'sent';
  recipient_count: number;
}

class EmailCampaign
  extends Model<EmailCampaignAttributes>
  implements EmailCampaignAttributes
{
  public id!: string;
  public subject!: string;
  public body!: string;
  public sent_at?: Date;
  public status!: 'draft' | 'sent';
  public recipient_count!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Association
  public readonly recipients?: Collaborator[];

  // Association methods that Sequelize will add
  public addRecipient!: Function;
  public addRecipients!: (recipients: Collaborator[]) => Promise<void>;
  public getRecipients!: Function;
  public setRecipients!: Function;
  public removeRecipient!: Function;
  public removeRecipients!: Function;
  public countRecipients!: Function;
}

EmailCampaign.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 200],
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: 'EmailCampaign',
    timestamps: true,
  }
);

// Add hooks after initialization
EmailCampaign.afterCreate(async (instance: EmailCampaign) => {
  try {
    const count = await instance.countRecipients();
    if (instance.recipient_count !== count) {
      await instance.update(
        { recipient_count: count },
        {
          hooks: false,
        }
      );
    }
  } catch (error) {
    console.error('Failed to update recipient count:', error);
  }
});

EmailCampaign.afterBulkCreate(
  async (instances: readonly EmailCampaign[], options: any) => {
    try {
      for (const instance of instances) {
        const count = await instance.countRecipients();
        if (instance.recipient_count !== count) {
          await instance.update(
            { recipient_count: count },
            {
              hooks: false,
            }
          );
        }
      }
    } catch (error) {
      console.error('Failed to update recipient count for bulk create:', error);
    }
  }
);

export default EmailCampaign;
