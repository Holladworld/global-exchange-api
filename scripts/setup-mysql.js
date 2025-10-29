const mysql = require('mysql2/promise');

const setupDatabase = async () => {
  console.log('🚀 Setting up MySQL database...\n');
  
  try {
    // First connect as root to create database and user
    const rootConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '' // Try without password first
    });

    console.log('✅ Connected as root user');
    
    // Create database
    await rootConnection.execute('CREATE DATABASE IF NOT EXISTS global_exchange_db');
    console.log('✅ Database global_exchange_db created');
    
    // Create user (this might fail if user exists, that's ok)
    try {
      await rootConnection.execute("CREATE USER 'globalexchange'@'localhost' IDENTIFIED BY 'GEXB1234'");
      console.log('✅ User globalexchange created');
    } catch (e) {
      console.log('ℹ️  User globalexchange already exists');
    }
    
    // Grant privileges
    await rootConnection.execute('GRANT ALL PRIVILEGES ON global_exchange_db.* TO "globalexchange"@"localhost"');
    await rootConnection.execute('FLUSH PRIVILEGES');
    console.log('✅ Privileges granted');
    
    await rootConnection.end();
    
    // Test connection with new user
    const appConnection = await mysql.createConnection({
      host: 'localhost',
      user: 'globalexchange',
      password: 'GEXB1234',
      database: 'global_exchange_db'
    });
    
    console.log('✅ Application user can connect successfully');
    await appConnection.end();
    
    console.log('\n🎯 MySQL setup complete! Your app should now work.');
    process.exit(0);
    
  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('\n💡 Manual setup required. Run these commands:');
    console.log('sudo mysql -u root');
    console.log('Then in MySQL:');
    console.log('CREATE DATABASE global_exchange_db;');
    console.log('CREATE USER \'globalexchange\'@\'localhost\' IDENTIFIED BY \'GEXB1234\';');
    console.log('GRANT ALL ON global_exchange_db.* TO \'globalexchange\'@\'localhost\';');
    console.log('FLUSH PRIVILEGES;');
    console.log('EXIT;');
    process.exit(1);
  }
};

setupDatabase();