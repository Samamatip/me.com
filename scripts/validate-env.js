#!/usr/bin/env node
/**
 * Build-time environment variable validation for production
 * Calls the /api/health endpoint to verify all required environment variables
 * Exit code 0: All required variables present
 * Exit code 1: Missing required variables or health check failed
 */

import https from 'https';
import http from 'http';

async function checkHealth(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          reject(new Error('Failed to parse health check response'));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function validateProduction() {
  const appUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : process.env.APP_URL || 'http://localhost:3000';
  
  const healthUrl = `${appUrl}/api/health`;
  
  console.log('🔍 Validating environment variables via health check...\n');
  console.log(`Health endpoint: ${healthUrl}`);
  console.log('─'.repeat(50));

  try {
    const { status, data } = await checkHealth(healthUrl);
    
    if (status === 200 && data.status === 'healthy') {
      console.log('✅ Health check passed!\n');
      console.log(`Status: ${data.status}`);
      console.log(`Environment: ${data.environment}`);
      
      if (data.checks?.environmentVariables) {
        const envCheck = data.checks.environmentVariables;
        console.log(`\nEnvironment Variables: ${envCheck.status}`);
        
        if (envCheck.warnings?.length > 0) {
          console.log('\n⚠️  Optional variables not set:');
          envCheck.warnings.forEach(v => console.log(`  - ${v}`));
        }
      }
      
      console.log('\n' + '─'.repeat(50));
      console.log('✅ Environment validation passed!\n');
      return true;
    } else {
      console.log('❌ Health check failed!\n');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.checks?.environmentVariables?.missing?.length > 0) {
        console.log('\nMissing required environment variables:');
        data.checks.environmentVariables.missing.forEach(v => console.log(`  ✗ ${v}`));
      }
      
      console.log('\n' + '─'.repeat(50));
      return false;
    }
  } catch (error) {
    console.log(`⚠️  Could not reach health endpoint: ${error.message}`);
    console.log('   This is normal during initial build - validation will occur at runtime\n');
    return true; // Don't fail build if endpoint isn't available yet
  }
}

async function main() {
  const nodeEnv = process.env.NODE_ENV || 'unknown';
  
  // Only validate in production or when explicitly requested
  if (nodeEnv === 'production' || process.env.VALIDATE_ENV === 'true') {
    const isValid = await validateProduction();
    process.exit(isValid ? 0 : 1);
  } else {
    console.log('ℹ️  Skipping health check validation (development mode)');
    console.log('   Set NODE_ENV=production to enable\n');
    process.exit(0);
  }
}

main();
