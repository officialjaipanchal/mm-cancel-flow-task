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
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd cancel-flow-task-main
   npm install
   ```

2. **Set up the database:**
   ```bash
   # If using local PostgreSQL
   npm run db:init
   
   # Or manually run the schema file
   psql -h localhost -U postgres -d your_database -f schema.sql
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Database Schema

The `schema.sql` file contains everything needed to set up the database:

- **Users table**: User accounts with email addresses
- **Subscriptions table**: Subscription details with pricing and status
- **Cancellations table**: Cancellation records with A/B testing variants

### Test Data Included

The schema includes comprehensive test data with 10 users covering various scenarios:

#### Primary A/B Testing Users (1-3)
- **John Doe**: $25/month → Variant B ($15/month)
- **Sarah Smith**: $29/month → Variant A ($14.50/month)  
- **Mike Johnson**: $25/month → Variant A ($12.50/month)

#### Additional Test Users (4-6)
- **Emma Wilson**: $29/month subscription
- **David Brown**: $25/month subscription
- **Lisa Garcia**: $29/month subscription

#### Edge Case Users (7-10)
- **Alex Chen**: $25/month, pending cancellation, accepted Variant A
- **Maria Rodriguez**: $29/month, pending cancellation, accepted Variant B
- **James Taylor**: $25/month, cancelled, declined Variant A
- **Anna Anderson**: $29/month, cancelled, declined Variant B

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

## Project Structure

```
src/
├── app/
│   ├── cancel/                    # Main cancellation flow
│   │   ├── page.tsx              # Entry point
│   │   ├── flow/                 # Regular cancellation flow
│   │   └── flow-looking/         # Downsell flow with A/B testing
│   ├── api/                      # API routes
│   │   ├── ab-testing/           # A/B testing logic
│   │   └── cancellation/         # Cancellation processing
│   └── page.tsx                  # Main profile page
├── lib/
│   ├── supabase.ts              # Database client and operations
│   ├── dataService.ts           # Data service layer
│   └── validation.ts            # Input validation and security
└── middleware.ts                # Security middleware
```

## API Endpoints

### A/B Testing
- `GET /api/ab-testing` - Get A/B testing data for a user
- `POST /api/ab-testing` - Assign A/B testing variant

### Cancellation
- `GET /api/cancellation` - Get cancellation data
- `POST /api/cancellation` - Process cancellation

### Rate Limiting
- `POST /api/clear-rate-limits` - Clear rate limits (development only)

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

### Running Tests
```bash
# Test A/B testing API
curl "http://localhost:3000/api/ab-testing?userId=550e8400-e29b-41d4-a716-446655440001&subscriptionId=550e8400-e29b-41d4-a716-446655440011"

# Test cancellation API
curl -X POST "http://localhost:3000/api/cancellation" \
  -H "Content-Type: application/json" \
  -d '{"userId":"550e8400-e29b-41d4-a716-446655440001","subscriptionId":"550e8400-e29b-41d4-a716-446655440011","downsellVariant":"B","reason":"Too expensive","acceptedDownsell":false}'
```

### Rate Limiting
For development, you can clear rate limits:
```bash
curl -X POST "http://localhost:3000/api/clear-rate-limits"
```

## Environment Variables

Create a `.env.local` file with your database configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
