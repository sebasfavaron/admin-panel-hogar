lets implement this architecture in this folder. Do it step by step asking for approval every now and then:

Here's a detailed MERN (PostgreSQL) architecture plan for an orphanage collaborators management system:

### **System Architecture**

```
 ┌─────────────────┐       ┌──────────────┐       ┌───────────────┐
 │ React Frontend  │──────▶️│ Express API  │──────▶️│ PostgreSQL DB │
 └─────────────────┘ HTTPS └──────┬───────┘  SQL  └───────────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ SendGrid API     │
                         │ (Email Campaigns)│
                         └──────────────────┘
```

---

### **1. Tech Stack Specification**

- **Frontend**: React 18 + Vite + TypeScript
- **State Management**: Tanstack Query (React Query)
- **HTTP Client**: Axios
- **UI Library**: MUI (Material-UI) + React-Table
- **Backend**: Express.js 4.x + Node.js 18
- **ORM**: Sequelize 7 + PostgreSQL 15
- **Auth**: JSON Web Tokens (JWT)
- **Email**: SendGrid API (Node.js SDK)
- **Validation**: Joi + Zod
- **Env Management**: dotenv + config

---

### **2. Folder Structure**

```bash
backend/
├── config/
│   └── database.js      # DB config
├── models/
│   ├── Collaborator.js  # ORM model
│   ├── Donation.js      # Financial contributions
│   └── EmailCampaign.js # Campaign tracking
├── migrations/          # Sequelize migrations
├── seeders/             # Initial test data
├── routes/
│   ├── auth.routes.js
│   ├── collaborator.routes.js
│   └── email.routes.js
├── controllers/
├── services/
│   └── email.service.js # SendGrid integration
├── middleware/
│   └── auth.js          # JWT verification
└── app.js               # Main entry

frontend/
├── src/
│   ├── features/
│   │   ├── collaborators/
│   │   │   ├── CollaboratorTable.jsx
│   │   │   └── AddCollaboratorForm.jsx
│   │   └── campaigns/
│   ├── app/
│   │   └── store.js     # Redux store
│   ├── services/        # API clients
│   └── assets/          # Static files
```

---

### **3. Database Schema Design**

**Tables** (with Sequelize model definitions):

1. **Collaborators**

```js
{
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  phone: DataTypes.STRING,
  help_type: {           // ENUM: 'financial', 'physical', 'both'
    type: DataTypes.ENUM,
    allowNull: false
  },
  last_contact: DataTypes.DATE,
  address: DataTypes.JSONB
}
```

2. **Donations** (Financial help tracking)

```js
{
  amount: DataTypes.DECIMAL(10,2),
  currency: DataTypes.STRING(3),
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  payment_method: DataTypes.STRING,
  collaboratorId: {      // Foreign key
    type: DataTypes.UUID,
    references: { model: 'Collaborators' }
  }
}
```

3. **EmailCampaigns**

```js
{
  subject: DataTypes.STRING,
  body: DataTypes.TEXT,
  sent_at: DataTypes.DATE,
  status: {              // ENUM: 'draft', 'scheduled', 'sent'
    type: DataTypes.ENUM,
    defaultValue: 'draft'
  },
  recipient_count: DataTypes.INTEGER
}
```

**Relationships**:

- Collaborator 1:M Donations
- Collaborator 1:M VolunteerActivities
- EmailCampaign M:M Collaborators (through CampaignRecipients)

---

### **4. Core API Endpoints**

```markdown
| Method | Endpoint                  | Description                         | Auth |
| ------ | ------------------------- | ----------------------------------- | ---- |
| POST   | /api/auth/login           | Admin authentication                | No   |
| GET    | /api/collaborators        | Filterable collaborator list        | Yes  |
| POST   | /api/collaborators        | Add new collaborator                | Yes  |
| POST   | /api/email-campaigns      | Create new campaign                 | Yes  |
| POST   | /api/email-campaigns/send | Batch send with recipient filtering | Yes  |
```

---

### **5. Email Service Implementation**

**SendGrid Integration Flow**:

1. User defines filters (help_type, last_contact date range)
2. System generates recipient list from PostgreSQL
3. Email service:

```js
async function sendBulkEmail(campaignId) {
  const campaign = await EmailCampaign.findByPk(campaignId);
  const recipients = await getFilteredCollaborators();

  const batchSize = 1000; // SendGrid limit
  for (let i = 0; i < recipients.length; i += batchSize) {
    await sgMail.sendMultiple({
      to: recipients.slice(i, i + batchSize),
      from: 'noreply@orphanage.org',
      subject: campaign.subject,
      html: compileTemplate(campaign.body),
    });
  }
}
```

---

### **6. Security Requirements**

1. **Backend**:

   - SQL injection prevention: Sequelize parameterized queries
   - CORS: Restrict to frontend domain
   - JWT refresh tokens with 15m expiration

2. **PostgreSQL**:
   - Row-level security (RLS) policies
   - Encrypted columns for PII (pgcrypto)
   - Regular backups to S3

---

### **7. Deployment Architecture**

```bash
Frontend: Vercel/Netlify (Static Hosting)
Backend:  Render.com (Node.js)
Database: Neon.tech (PostgreSQL)
Storage:  AWS S3 for backups
CI/CD:    GitHub Actions
```

**Environment Variables**:

```env
DATABASE_URL=postgres://user:pass@neon-host/orphanage-db
SENDGRID_API_KEY=SG.xxxx
JWT_SECRET=your_256bit_secret
```

This architecture supports handling 10k+ collaborators with optimized PostgreSQL indexes on `email` and `help_type` columns. All components can be containerized with Docker for local development.
