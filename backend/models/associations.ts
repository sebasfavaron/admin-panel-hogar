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
  });

  Collaborator.belongsToMany(EmailCampaign, {
    through: 'CampaignRecipients',
    as: 'receivedCampaigns',
  });
}
