import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_in_production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  databaseUrl: process.env.DATABASE_URL || '',
};

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set in environment variables');
}
