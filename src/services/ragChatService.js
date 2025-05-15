/**
 * RAG Chat Service using Azure OpenAI and Azure AI Search
 */

const { AzureOpenAI } = require("openai");
const { DefaultAzureCredential, getBearerTokenProvider } = require("@azure/identity");
const appConfig = require('../config/appConfig');

class RagChatService {
  constructor() {
    this.config = appConfig;
    
    // Validate required settings
    this.validateSettings();
    
    const scope = "https://cognitiveservices.azure.com/.default";
    const azureADTokenProvider = getBearerTokenProvider(new DefaultAzureCredential(), scope);
    
    // Initialize Azure OpenAI client with managed identity
    this.openAIClient = new AzureOpenAI({
      azureADTokenProvider, 
      apiVersion: "2024-02-01", // Update this to a known working API version
      endpoint: this.config.openai.endpoint
    });

    console.log('RagChatService initialized with settings');
  }
  
  validateSettings() {
    if (!this.config.openai.endpoint) {
      throw new Error('OpenAI endpoint must be configured');
    }
    if (!this.config.openai.gpt.deployment) {
      throw new Error('OpenAI GPT deployment must be configured');
    }
    if (!this.config.search.url) {
      throw new Error('Search service URL must be configured');
    }
    if (!this.config.search.index.name) {
      throw new Error('Search index name must be configured');
    }
  }
  
  /**
   * Processes a chat completion request with RAG capabilities by integrating with Azure AI Search.
   *
   * @param {Array} history - The chat history containing previous messages
   * @returns {Object} - A response containing the AI-generated content and citations
   */
  async getChatCompletion(history) {
    try {
      // Limit chat history to the 20 most recent messages to prevent token limit issues
      const recentHistory = history.length <= 20 
        ? history 
        : history.slice(history.length - 20);
      
      // Add system message to provide context and instructions to the model
      const messages = [
        { role: 'system', content: this.config.systemPrompt },
        ...recentHistory
      ];
      
      // Configure Azure AI Search data source
      // For information see https://learn.microsoft.com/azure/ai-services/openai/references/azure-search
      const searchDataSource = {
        type: 'azure_search',
        parameters: {
          endpoint: this.config.search.url,
          index_name: this.config.search.index.name,
          authentication: {
            type: 'system_assigned_managed_identity'
          },
          query_type: 'vector_semantic_hybrid',
          semantic_configuration: `${this.config.search.index.name}-semantic-configuration`,
          embedding_dependency: {
            type: 'deployment_name',
            deployment_name: this.config.openai.embedding.deployment
          }
        }
      };
      
      // Call Azure OpenAI for completion
      const response = await this.openAIClient.chat.completions.create({
        model: this.config.openai.gpt.deployment,
        messages: messages,
        data_sources: [searchDataSource]
      });
      
      return response;
    } catch (error) {
      console.error('Error in getChatCompletion:', error);
      
      // Check if this is a rate limit error
      if (error.status === 400 && error.error && error.error.message && error.error.message.includes('Rate limit is exceeded')) {
        // Extract the rate limit message from the error
        const rateLimitMatch = error.error.message.match(/Rate limit is exceeded\. Try again in (\d+) seconds/);
        const waitTime = rateLimitMatch ? rateLimitMatch[1] : 'a few';
        
        const rateLimitError = new Error("The AI service is currently experiencing high demand. Please wait a moment and try again.");
        rateLimitError.code = 'RATE_LIMIT_EXCEEDED';
        rateLimitError.retryAfter = parseInt(waitTime) || 5;
        throw rateLimitError;
      }
      
      throw error;
    }
  }
}

module.exports = new RagChatService();
