/**
 * Configuration settings for the RAG application
 */

const appConfig = {
  openai: {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT,
    gpt: {
      deployment: process.env.AZURE_OPENAI_GPT_DEPLOYMENT
    },
    embedding: {
      deployment: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT
    }
  },
  search: {
    url: process.env.AZURE_SEARCH_SERVICE_URL,
    index: {
      name: process.env.AZURE_SEARCH_INDEX_NAME
    }
  },
  systemPrompt: process.env.SYSTEM_PROMPT || 'You are an AI assistant that helps people find information from their documents. Always cite your sources using the document title.'
};

module.exports = appConfig;
