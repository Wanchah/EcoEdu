/**
 * Validates required environment variables on startup
 * This prevents the app from starting with missing critical configuration
 */

export function validateEnv() {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missing = [];
  const warnings = [];

  // Check required variables
  required.forEach((key) => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  // Check for production-specific requirements
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.CLIENT_URL) {
      warnings.push('CLIENT_URL should be set in production');
    }
    
    if (process.env.JWT_SECRET === 'default-secret-change-in-production') {
      warnings.push('⚠️  JWT_SECRET is using default value! This is insecure in production!');
    }
  }

  // Exit if critical variables are missing
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n💡 Create a .env file with these variables.');
    process.exit(1);
  }

  // Warn about potential issues
  if (warnings.length > 0) {
    console.warn('\n⚠️  Environment variable warnings:');
    warnings.forEach((warning) => console.warn(`   ${warning}`));
  }

  console.log('✅ Environment variables validated');
}

