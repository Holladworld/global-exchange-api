const mysql = require('mysql2/promise');

const testConnection = async () => {
  console.log('🧪 Testing MySQL Connection with globalexchange user...\n');
  
  const config = {
    host: 'localhost',
    port: 3306,
    user: 'globalexchange',
    password: 'GEXB1234',
    database: 'global_exchange_db'
  };

  try {
    const connection = await mysql.createConnection(config);
    console.log('✅ MySQL Connection SUCCESSFUL!');
    console.log('   User: globalexchange');
    console.log('   Database: global_exchange_db');
    
    // Test if we can query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('   Query test: PASSED');
    
    await connection.end();
    console.log('\n🎯 MySQL is ready for the application!');
    process.exit(0);
  } catch (error) {
    console.log('❌ MySQL Connection FAILED:', error.message);
    console.log('\n💡 Solutions:');
    console.log('1. Make sure MySQL is running: sudo systemctl status mysql');
    console.log('2. Create the user and database with these commands:');
    console.log('   sudo mysql -u root -e "CREATE DATABASE global_exchange_db;"');
    console.log('   sudo mysql -u root -e "CREATE USER \'globalexchange\'@\'localhost\' IDENTIFIED BY \'GEXB1234\';"');
    console.log('   sudo mysql -u root -e "GRANT ALL ON global_exchange_db.* TO \'globalexchange\'@\'localhost\';"');
    console.log('   sudo mysql -u root -e "FLUSH PRIVILEGES;"');
    process.exit(1);
  }
};

testConnection();