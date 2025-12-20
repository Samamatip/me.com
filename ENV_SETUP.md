# Environment Variables Setup

This application requires certain environment variables to be configured for proper operation.

## Required Variables

All of these variables **must** be set in production:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `RESEND_API_KEY` - API key for Resend email service
- `CONTACT_EMAIL` - Email address where contact form submissions are sent

## Optional Variables

- `RESEND_FROM_EMAIL` - Custom from email address (defaults to `onboarding@resend.dev`)

## Setup Instructions

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values in `.env.local`

### Production Deployment

Ensure all required environment variables are set in your deployment platform:

#### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each required variable

#### Other Platforms
Refer to your platform's documentation for setting environment variables.

## Verification

### Health Check Endpoint

You can verify that all environment variables are properly configured by visiting:

```
GET /api/health
```

This endpoint will return:
- `200 OK` - All required variables are present
- `503 Service Unavailable` - Missing required variables (with details)

Example response when healthy:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-20T10:00:00.000Z",
  "environment": "production",
  "checks": {
    "environmentVariables": {
      "status": "pass",
      "missing": [],
      "warnings": []
    }
  }
}
```

Example response when unhealthy:
```json
{
  "status": "unhealthy",
  "timestamp": "2025-12-20T10:00:00.000Z",
  "environment": "production",
  "message": "Required environment variables are missing. Please check your deployment configuration.",
  "checks": {
    "environmentVariables": {
      "status": "fail",
      "missing": ["JWT_SECRET", "MONGODB_URI"],
      "warnings": []
    }
  }
}
```

## Troubleshooting

### Build Failures

If your build fails with environment variable errors:

1. Check that all required variables are set in your deployment platform
2. Verify the variable names match exactly (they are case-sensitive)
3. Ensure there are no extra spaces or quotes around the values

### Runtime Errors

If you see errors about missing environment variables at runtime:

1. Check your deployment logs for the specific missing variable
2. Visit `/api/health` to see which variables are missing
3. Add the missing variables to your deployment configuration
4. Redeploy your application

## Security Notes

- Never commit `.env.local` or `.env` files to version control
- Use different values for development and production
- Rotate secrets regularly, especially `JWT_SECRET`
- Use environment-specific MongoDB databases
