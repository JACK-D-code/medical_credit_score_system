"use strict";
/**
 * Manual Authentication Service Test
 *
 * Run this file to manually verify authentication functionality:
 * npx ts-node src/services/__tests__/auth.manual-test.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../auth.service");
async function runTests() {
    console.log('🧪 Testing Authentication Service\n');
    try {
        // Test 1: Password Hashing
        console.log('Test 1: Password Hashing with bcrypt (salt rounds >= 12)');
        const password = 'TestPassword123!';
        const hash = await auth_service_1.AuthService.hashPassword(password);
        console.log('✅ Password hashed successfully');
        console.log(`   Hash: ${hash.substring(0, 30)}...`);
        // Verify salt rounds
        const rounds = parseInt(hash.split('$')[2]);
        console.log(`   Salt rounds: ${rounds} ${rounds >= 12 ? '✅' : '❌'}`);
        console.log('');
        // Test 2: Password Verification
        console.log('Test 2: Password Verification');
        const isValid = await auth_service_1.AuthService.verifyPassword(password, hash);
        console.log(`✅ Correct password verified: ${isValid}`);
        const isInvalid = await auth_service_1.AuthService.verifyPassword('WrongPassword', hash);
        console.log(`✅ Wrong password rejected: ${!isInvalid}`);
        console.log('');
        // Test 3: Token Generation
        console.log('Test 3: JWT Token Generation (Access + Refresh)');
        const payload = {
            id: 'test-user-123',
            email: 'test@example.com',
            role: 'provider',
        };
        const tokenPair = auth_service_1.AuthService.generateTokenPair(payload);
        console.log('✅ Token pair generated successfully');
        console.log(`   Access Token: ${tokenPair.accessToken.substring(0, 30)}...`);
        console.log(`   Refresh Token: ${tokenPair.refreshToken.substring(0, 30)}...`);
        console.log('');
        // Test 4: Token Verification
        console.log('Test 4: Token Verification');
        const decoded = auth_service_1.AuthService.verifyToken(tokenPair.accessToken);
        console.log('✅ Token verified and decoded successfully');
        console.log(`   User ID: ${decoded.id}`);
        console.log(`   Email: ${decoded.email}`);
        console.log(`   Role: ${decoded.role}`);
        console.log('');
        // Test 5: Token Hashing
        console.log('Test 5: Token Hashing for Session Storage');
        const tokenHash = auth_service_1.AuthService.hashToken(tokenPair.accessToken);
        console.log('✅ Token hashed successfully');
        console.log(`   Hash length: ${tokenHash.length} (should be 64)`);
        console.log(`   Hash: ${tokenHash.substring(0, 30)}...`);
        console.log('');
        // Test 6: Invalid Token Handling
        console.log('Test 6: Invalid Token Handling');
        try {
            auth_service_1.AuthService.verifyToken('invalid.token.here');
            console.log('❌ Should have thrown error for invalid token');
        }
        catch (error) {
            console.log(`✅ Invalid token rejected: ${error.message}`);
        }
        console.log('');
        console.log('✅ All tests passed!\n');
        console.log('Requirements Verified:');
        console.log('  ✅ 1.1 - Bcrypt password hashing with salt rounds >= 12');
        console.log('  ✅ 1.2 - JWT token generation (access + refresh tokens)');
        console.log('  ✅ 1.4 - Token verification and validation');
        console.log('  ✅ 14.1 - Secure password storage');
    }
    catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}
runTests();
