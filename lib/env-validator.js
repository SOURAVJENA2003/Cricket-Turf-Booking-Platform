// Central environment variable validation to fail fast on start

// Load .env file in case it hasn't been loaded yet (useful for scripts)
if (typeof window === 'undefined') {
  if (!process.env.DATABASE_URL) {
    try {
      require('dotenv').config();
    } catch (e) {
      // Ignore if dotenv is not available or failed
    }
  }

  const criticalEnvVars = [
    'DATABASE_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH',
    'JWT_SECRET',
    'UPI_ID',
    'UPI_NAME',
    'DEFAULT_SLOT_PRICE'
  ];

  const missing = [];
  for (const key of criticalEnvVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const errorMsg = `CRITICAL CONFIGURATION ERROR: The following required environment variables are missing: ${missing.join(', ')}. Please check your .env file or deployment settings.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}
