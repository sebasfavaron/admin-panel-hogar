import Collaborator from './Collaborator';
import Donation from './Donation';
import EmailCampaign from './EmailCampaign';

export function setupAssociations() {
  // Donation associations
  Donation.belongsTo(Collaborator);
  Collaborator.hasMany(Donation);

  // Email campaign associations
  EmailCampaign.belongsToMany(Collaborator, {
    through: 'CampaignRecipients',
    as: 'recipients',
    foreignKey: 'EmailCampaignId',
    otherKey: 'CollaboratorId',
  });

  Collaborator.belongsToMany(EmailCampaign, {
    through: 'CampaignRecipients',
    as: 'campaigns',
    foreignKey: 'CollaboratorId',
    otherKey: 'EmailCampaignId',
  });
}
