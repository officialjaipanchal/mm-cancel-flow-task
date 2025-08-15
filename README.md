<img width="449" height="982" alt="image" src="https://github.com/user-attachments/assets/4567ccee-7274-4310-9124-0ef9a2f4a74c" /><img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/ceb28958-a9cb-476b-8d68-185e7769809a" /><img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/c29cf502-1bf5-4668-a0e4-4ce5ac5069cc" /># Subscription Cancellation Flow

A comprehensive subscription cancellation flow with A/B testing, dynamic pricing, and data persistence.

## Screenshots
<img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/b8dc7cc5-0440-4c93-9955-b6792ce4d30d" />
<img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/39e00c95-4dc9-4e7c-a507-04f1652b1ff2" />
<img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/c301a9e7-3781-424b-bd8a-d17a69052e65" />
<img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/dba3a39f-7ba3-4f6f-a3b4-ad11e447a289" />
<img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/7b6d10c1-071f-412e-874e-d0dfe20bc246" />
<img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/dd3ac241-4821-4e8c-8211-437c3c042b09" />
<img width="1915" height="1034" alt="image" src="https://github.com/user-attachments/assets/5973813a-086b-4063-bb63-b2a169f9a6c3" />
<img width="827" height="390" alt="image" src="https://github.com/user-attachments/assets/77cfd4ac-fcab-481a-ae8b-096c9a39bdd3" />
<img width="1917" height="978" alt="image" src="https://github.com/user-attachments/assets/b8536272-97eb-448a-92ba-ada5af751a94" />
<img width="1917" height="978" alt="image" src="https://github.com/user-attachments/assets/9b41e01b-67d6-4e67-ad98-329ba3b16b38" />
<img width="829" height="254" alt="image" src="https://github.com/user-attachments/assets/77c4dfbf-0f9f-405e-9f90-cc7616430264" />
<img width="449" height="982" alt="image" src="https://github.com/user-attachments/assets/bc5ddb50-f172-4e9c-85c0-2f8f7ce5f777" />
<img width="449" height="982" alt="image" src="https://github.com/user-attachments/assets/71a92d80-142c-4b3b-9d46-da390641f303" />
<img width="449" height="982" alt="image" src="https://github.com/user-attachments/assets/5fe0ca72-abbd-4ce8-90a1-5ab7fabf4b28" />
<img width="449" height="982" alt="image" src="https://github.com/user-attachments/assets/26ac7295-5384-4574-9db3-4ce68ca28fdd" />
<img width="831" height="424" alt="image" src="https://github.com/user-attachments/assets/1e1e354a-d812-4b47-8adc-019aff81a221" />
<img width="1427" height="494" alt="image" src="https://github.com/user-attachments/assets/511a1b04-c408-40d7-829d-80839b7d31eb" />


## Features

- **Progressive Flow**: Pixel-perfect cancellation journey with mobile and desktop support
- **A/B Testing**: Deterministic variant assignment (50/50 split) with persistence
- **Dynamic Pricing**: Variant A (50% off) vs Variant B ($10 off) with real-time calculation
- **Data Persistence**: Full database integration with subscription status updates
- **Security**: Input validation, CSRF/XSS protection, and Row Level Security (RLS)
- **Responsive Design**: Mobile-first approach with fixed bottom buttons and scrollable content

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL (local or remote)
- npm 

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd cancel-flow-task-main
   npm install
   ```

2. **Set up the database:**
   ```bash
   # If using local PostgreSQL
   npm run db:init
   
   # Or manually run the schema file
   psql -h localhost -U postgres -d your_database -f seed.sql

   ## Environment Variables

   Create a `.env.local` file with your database configuration:
   
   env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Database Schema

The `seed.sql` file contains everything needed to set up the database:

- **Users table**: User accounts with email addresses
- **Subscriptions table**: Subscription details with pricing and status
- **Cancellations table**: Cancellation records with A/B testing variants

### Test Data Included

The schema includes comprehensive test data with 10 users covering various scenarios:

#### Primary A/B Testing Users (1-3)
- **John Doe**: $25/month → Variant B ($15/month)
- **Sarah Smith**: $29/month → Variant A ($14.50/month)  
- **Mike Johnson**: $25/month → Variant A ($12.50/month)

## A/B Testing Variants

- **Variant A**: 50% off original price
  - $25 → $12.50
  - $29 → $14.50

- **Variant B**: $10 off original price
  - $25 → $15.00
  - $29 → $19.00

## Usage

1. **Sign in**: Select a test user from the sign-in page
2. **Navigate to cancellation**: Click "Cancel Subscription" on the profile page
3. **Experience the flow**: Go through the cancellation steps
4. **Test different scenarios**: Try different users to see various A/B testing outcomes


## Security Features

- **Input Validation**: Comprehensive validation for all user inputs
- **XSS Protection**: Input sanitization to prevent cross-site scripting
- **CSRF Protection**: Token-based protection against cross-site request forgery
- **Rate Limiting**: Prevents abuse with configurable limits
- **Row Level Security**: Database-level security policies
- **Secure Headers**: Security headers via middleware

## Development

### Database Setup
```bash
# Initialize database with schema and test data
npm run db:init
```
## Environment Variables

Create a `.env.local` file with your database configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```


## License

This project is licensed under the MIT License.
