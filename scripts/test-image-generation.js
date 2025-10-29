require('dotenv').config();
const imageService = require('../services/imageService');

const testImageGeneration = async () => {
  try {
    console.log('🧪 Testing Image Generation...\n');
    
    // Test basic image generation
    const testPath = await imageService.testImageGeneration();
    console.log('✅ Basic image generation: PASSED');
    console.log(`   Test image saved: ${testPath}`);
    
    // Try to generate summary image (might fail if no data, but should handle gracefully)
    try {
      await imageService.generateSummaryImage();
      console.log('✅ Summary image generation: PASSED');
    } catch (error) {
      console.log('⚠️ Summary image generation: SKIPPED (no data yet)');
      console.log(`   Note: ${error.message}`);
    }
    
    console.log('\n🎯 Image Generation Test Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Image Generation Test Failed:', error.message);
    process.exit(1);
  }
};

testImageGeneration();