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

  const universalEnvVars = [
    'DATABASE_URL',
    'ADMIN_EMAIL',
    'ADMIN_PASSWORD_HASH',
    'JWT_SECRET'
  ];

  const missing = [];
  for (const key of universalEnvVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Conditionally validate Razorpay keys (if one is present, both must be present)
  if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_SECRET) {
    missing.push('RAZORPAY_KEY_SECRET');
  }
  if (!process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    missing.push('RAZORPAY_KEY_ID');
  }

  if (missing.length > 0) {
    const errorMsg = `CRITICAL CONFIGURATION ERROR: The following required environment variables are missing: ${missing.join(', ')}. Please check your .env file or deployment settings.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}
