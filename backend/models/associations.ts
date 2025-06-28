import Collaborator from './Collaborator';
import Donation from './Donation';
import EmailCampaign from './EmailCampaign';

export function setupAssociations(): void {
  // Collaborator has many Donations
  Collaborator.hasMany(Donation, {
    foreignKey: 'collaboratorId',
    as: 'donations',
  });

  // Donation belongs to a Collaborator
  Donation.belongsTo(Collaborator, {
    foreignKey: 'collaboratorId',
    as: 'collaborator',
  });

  // Many-to-many relationship between EmailCampaign and Collaborator
  EmailCampaign.belongsToMany(Collaborator, {
    through: 'CampaignRecipients',
    as: 'recipients',
    foreignKey: 'EmailCampaignId',
  });

  Collaborator.belongsToMany(EmailCampaign, {
    through: 'CampaignRecipients',
    as: 'campaigns',
    foreignKey: 'collaboratorId',
  });
}
