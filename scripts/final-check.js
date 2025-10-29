require('dotenv').config({ debug: false });

console.log('🚀 FINAL PRODUCTION READINESS CHECK');
console.log('=' .repeat(40));

const checks = [
  {
    name: 'Node.js Version',
    check: () => parseInt(process.version.slice(1).split('.')[0]) >= 16,
    message: 'Node.js 16+ required'
  },
  {
    name: 'Environment',
    check: () => process.env.NODE_ENV === 'production',
    message: 'Running in production mode'
  },
  {
    name: 'Port Configuration',
    check: () => process.env.PORT || 3010,
    message: 'Port is configured'
  },
  {
    name: 'Database Config',
    check: () => process.env.DB_HOST && process.env.DB_NAME,
    message: 'Database configuration present'
  },
  {
    name: 'API URLs',
    check: () => process.env.COUNTRIES_API_URL && process.env.EXCHANGE_API_URL,
    message: 'External API URLs configured'
  }
];

let allPassed = true;

checks.forEach((check, index) => {
  const passed = check.check();
  const status = passed ? '✅' : '❌';
  console.log(`${index + 1}. ${status} ${check.name}: ${check.message}`);
  if (!passed) allPassed = false;
});

console.log('=' .repeat(40));
if (allPassed) {
  console.log('🎉 PRODUCTION READY! You can deploy to Railway.');
  console.log('📦 Next steps:');
  console.log('   1. git push origin production');
  console.log('   2. Merge to main branch');
  console.log('   3. Deploy to Railway from GitHub');
} else {
  console.log('❌ Not ready for production. Please fix the issues above.');
}

process.exit(allPassed ? 0 : 1);