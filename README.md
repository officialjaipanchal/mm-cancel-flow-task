# Subscription Cancellation Flow

A comprehensive subscription cancellation flow with A/B testing, dynamic pricing, and data persistence.

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
