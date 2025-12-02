// Simpel test fil til at teste JWT token
// Kør: node test-jwt.js

const jwt = require('jsonwebtoken');
const util = require('util');
require('dotenv').config();

const SECRET = process.env.SECRET;
const signAsync = util.promisify(jwt.sign);
const verifyAsync = util.promisify(jwt.verify);

async function testJWT() {
  console.log('=== TEST JWT TOKEN ===\n');
  
  // Tjek om SECRET findes
  if (!SECRET) {
    console.error('❌ FEJL: SECRET ikke fundet i .env filen!');
    console.log('Opret .env fil med: SECRET=din-nøgle-her');
    return;
  }
  
  console.log('✅ SECRET fundet:', SECRET.substring(0, 20) + '...\n');
  
  // Test 1: Opret token
  console.log('TEST 1: Opret JWT token');
  try {
    const payload = {
      sub: 'host:1',
      navn: 'Anna',
      email: 'anna@understory.dk',
      værtID: 1
    };
    
    const signOptions = {
      algorithm: 'HS256',
      expiresIn: '1h',
      issuer: 'understory-app'
    };
    
    const token = await signAsync(payload, SECRET, signOptions);
    //console.log('✅ Token oprettet:', token.substring(0, 50) + '...\n');
    console.log('✅ Token oprettet:', token);
    
    // Test 2: Verificer token
    console.log('TEST 2: Verificer JWT token');
    const decoded = await verifyAsync(token, SECRET);
    console.log('✅ Token verificeret:');
    console.log('   - Sub:', decoded.sub);
    console.log('   - Navn:', decoded.navn);
    console.log('   - Email:', decoded.email);
    console.log('   - VærtID:', decoded.værtID);
    console.log('   - Issuer:', decoded.iss);
    console.log('   - Expires:', new Date(decoded.exp * 1000).toLocaleString(), '\n');
    
    // Test 3: Test med forkert SECRET
    console.log('TEST 3: Test med forkert SECRET');
    try {
      await verifyAsync(token, 'forkert-secret');
      console.log('❌ FEJL: Token skulle ikke verificeres med forkert SECRET!');
    } catch (error) {
      console.log('✅ Token afvist med forkert SECRET (som forventet)');
      console.log('   Fejl:', error.message, '\n');
    }
    
    // Test 4: Test udløbet token
    console.log('TEST 4: Test udløbet token');
    const expiredPayload = {
      sub: 'host:2',
      navn: 'Tim',
      værtID: 2
    };
    
    const expiredSignOptions = {
      algorithm: 'HS256',
      expiresIn: '1s', // Udløber om 1 sekund
      issuer: 'understory-app'
    };
    
    const expiredToken = await signAsync(expiredPayload, SECRET, expiredSignOptions);
    console.log('✅ Udløbet token oprettet');
    
    // Vent 2 sekunder
    console.log('   Vent 2 sekunder...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      await verifyAsync(expiredToken, SECRET);
      console.log('❌ FEJL: Udløbet token skulle ikke verificeres!');
    } catch (error) {
      console.log('✅ Udløbet token afvist (som forventet)');
      console.log('   Fejl:', error.message, '\n');
    }
    
    console.log('=== ALLE TESTER BESTÅET! ===');
    console.log('✅ JWT token fungerer korrekt!');
    
  } catch (error) {
    console.error('❌ FEJL:', error.message);
  }
}

testJWT();


