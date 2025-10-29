// In your startServer function, replace the database connection part:
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔧 Port: ${PORT}`);

    // Check if MySQL environment variables exist
    const hasDbConfig = process.env.MYSQLHOST && process.env.MYSQLDATABASE;
    
    if (hasDbConfig) {
      // Test database connection with retry logic
      let dbConnected = false;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!dbConnected && retryCount < maxRetries) {
        try {
          await sequelize.authenticate();
          console.log('✅ Database connected successfully');
          dbConnected = true;
          
          // Sync database
          console.log('🔄 Syncing database models...');
          await sequelize.sync({ alter: true });
          console.log('✅ Database models synchronized');
        } catch (dbError) {
          retryCount++;
          console.log(`⚠️ Database connection attempt ${retryCount} failed: ${dbError.message}`);
          if (retryCount < maxRetries) {
            console.log(`🔄 Retrying in 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
          } else {
            console.log('❌ Max database connection retries reached');
            console.log('💡 Please check your Railway MySQL service');
          }
        }
      }
    } else {
      console.log('⚠️ No database configuration found');
      console.log('💡 Add MySQL service in Railway dashboard');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (hasDbConfig) {
        console.log('✅ Database: Configured (check connection status above)');
      } else {
        console.log('⚠️ Database: Not configured - add MySQL service in Railway');
      }
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
};