import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Redis Configuration Check\n');

console.log('Environment Variables:');
console.log(`REDIS_HOST: ${process.env.REDIS_HOST || 'NOT SET'}`);
console.log(`REDIS_PASSWORD: ${process.env.REDIS_PASSWORD ? 'SET (hidden)' : 'NOT SET'}`);
console.log(`REDIS_URL: ${process.env.REDIS_URL || 'NOT SET'}\n`);

console.log('Redis Client Configuration:');
console.log(`Host: ${process.env.REDIS_HOST || 'localhost (default)'}`);
console.log(`Port: 6379`);
console.log(`TLS: enabled`);
console.log(`Username: default`);
console.log(`Password: ${process.env.REDIS_PASSWORD ? 'provided' : 'NOT PROVIDED'}\n`);

// Check if we're trying to connect to localhost
if (!process.env.REDIS_HOST || process.env.REDIS_HOST === 'localhost' || process.env.REDIS_HOST === '127.0.0.1') {
  console.log('⚠️  WARNING: Connecting to localhost Redis');
  console.log('   Make sure Redis server is running locally:');
  console.log('   - Install: sudo apt install redis-server (Ubuntu) or brew install redis (macOS)');
  console.log('   - Start: sudo systemctl start redis (Ubuntu) or brew services start redis (macOS)');
  console.log('   - Test: redis-cli ping\n');
} else {
  console.log('✅ Using remote Redis server');
  console.log(`   Host: ${process.env.REDIS_HOST}\n`);
}

// Recommendations
console.log('💡 Recommendations:');
if (!process.env.REDIS_HOST) {
  console.log('   - Set REDIS_HOST in your .env file');
}
if (!process.env.REDIS_PASSWORD) {
  console.log('   - Set REDIS_PASSWORD in your .env file');
}
console.log('   - For local development, consider using Redis without TLS');
console.log('   - For production, use a cloud Redis service (Upstash, Redis Cloud, etc.)');
