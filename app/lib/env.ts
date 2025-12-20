/**
 * Environment variable validation utility
 * Ensures all required environment variables are present at runtime
 */

interface EnvConfig {
  MONGODB_URI: string;
  JWT_SECRET: string;
  RESEND_API_KEY: string;
  CONTACT_EMAIL: string;
  RESEND_FROM_EMAIL?: string;
}

interface ValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'RESEND_API_KEY',
  'CONTACT_EMAIL',
] as const;

/**
 * Optional environment variables (will show warnings if missing)
 */
const OPTIONAL_ENV_VARS = [
  'RESEND_FROM_EMAIL',
] as const;

/**
 * Validates that all required environment variables are present
 * @returns ValidationResult object with validation status
 */
export const validateEnv = (): ValidationResult => {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check optional variables
  for (const envVar of OPTIONAL_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Validates environment variables and throws an error if any required ones are missing
 * Use this at application startup or in critical paths
 */
export const requireEnv = (): void => {
  const result = validateEnv();
  
  if (!result.isValid) {
    const errorMessage = `
❌ Missing required environment variables:
${result.missing.map(v => `  - ${v}`).join('\n')}

Please ensure all required environment variables are set in your environment.
Check .env.example for reference.
`;
    throw new Error(errorMessage);
  }

  if (result.warnings.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn(`
⚠️  Optional environment variables not set:
${result.warnings.map(v => `  - ${v}`).join('\n')}
`);
  }
}

/**
 * Get a required environment variable or throw an error
 */
export function getRequiredEnv(key: keyof EnvConfig): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

/**
 * Get an optional environment variable with a default value
 */
export const getOptionalEnv = (key: string, defaultValue: string = ''): string => {
  return process.env[key] || defaultValue;
}

/**
 * Type-safe environment configuration getter
 */
export const getEnvConfig = (): EnvConfig => {
  return {
    MONGODB_URI: getRequiredEnv('MONGODB_URI'),
    JWT_SECRET: getRequiredEnv('JWT_SECRET'),
    RESEND_API_KEY: getRequiredEnv('RESEND_API_KEY'),
    CONTACT_EMAIL: getRequiredEnv('CONTACT_EMAIL'),
    RESEND_FROM_EMAIL: getOptionalEnv('RESEND_FROM_EMAIL', 'onboarding@resend.dev'),
  };
}
