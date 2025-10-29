require('dotenv').config();

console.log('🔧 Database Connection Troubleshooter');
console.log('=====================================');
console.log('Environment variables:');
console.log(`- DB_HOST: ${process.env.DB_HOST}`);
console.log(`- DB_PORT: ${process.env.DB_PORT}`);
console.log(`- DB_NAME: ${process.env.DB_NAME}`);
console.log(`- DB_USER: ${process.env.DB_USER}`);
console.log(`- DB_PASSWORD: ${process.env.DB_PASSWORD ? '***set***' : 'NOT SET'}`);

console.log('\n💡 Common solutions:');
console.log('1. Make sure PostgreSQL is running: sudo systemctl status postgresql');
console.log('2. Create database: sudo -u postgres psql -c "CREATE DATABASE global_exchange_db;"');
console.log('3. Check if you can connect manually: psql -h localhost -U postgres -d global_exchange_db');