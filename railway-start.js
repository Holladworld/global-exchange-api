require('dotenv').config();
const logger = require('./utils/logger');

logger.info('🚂 Starting Railway-specific initialization...');

// Check critical environment variables
const requiredEnvVars = ['NODE_ENV', 'PORT'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
  logger.info('💡 Set these in Railway dashboard → Settings → Variables');
  process.exit(1);
}

logger.info('✅ Environment variables check passed');
logger.info(`🌐 NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`🔌 PORT: ${process.env.PORT}`);
logger.info(`🗄️ DB_HOST: ${process.env.DB_HOST || 'Not set (using DATABASE_URL)'}`);

// Start the server
require('./server');