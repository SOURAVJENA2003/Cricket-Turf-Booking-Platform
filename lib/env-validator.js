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
    'JWT_SECRET',
    'DEFAULT_SLOT_PRICE',
    'TURF_NAME',
    'TURF_ADDRESS',
    'TURF_GOOGLE_MAPS',
    'TURF_OPEN_TIME',
    'TURF_CLOSE_TIME'
  ];

  const missing = [];
  for (const key of universalEnvVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  const paymentMode = process.env.PAYMENT_MODE || 'upi';
  if (paymentMode === 'upi') {
    if (!process.env.UPI_ID) missing.push('UPI_ID');
    if (!process.env.UPI_NAME) missing.push('UPI_NAME');
  } else if (paymentMode === 'razorpay') {
    if (!process.env.RAZORPAY_KEY_ID) missing.push('RAZORPAY_KEY_ID');
    if (!process.env.RAZORPAY_KEY_SECRET) missing.push('RAZORPAY_KEY_SECRET');
  } else {
    const errorMsg = `CRITICAL CONFIGURATION ERROR: Invalid PAYMENT_MODE "${paymentMode}". Supported values are "upi" or "razorpay".`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (missing.length > 0) {
    const errorMsg = `CRITICAL CONFIGURATION ERROR: The following required environment variables are missing: ${missing.join(', ')}. Please check your .env file or deployment settings.`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
}
