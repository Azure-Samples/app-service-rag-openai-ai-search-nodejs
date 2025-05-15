/**
 * Environment variable validation utility
 */

function validateEnvironment() {
  const requiredVars = [
    'AZURE_OPENAI_ENDPOINT',
    'AZURE_OPENAI_GPT_DEPLOYMENT',
    'AZURE_OPENAI_EMBEDDING_DEPLOYMENT',
    'AZURE_SEARCH_SERVICE_URL',
    'AZURE_SEARCH_INDEX_NAME'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.info('For development, create a .env file with these variables.');
  }
}

module.exports = {
  validateEnvironment
};
