# Infrastructure for Express.js RAG with Azure OpenAI and Azure AI Search

This directory contains Bicep templates for deploying the necessary Azure resources for the Express.js RAG application.

## Resources deployed

- Azure App Service (Linux) with Node.js runtime
- Azure OpenAI with GPT and Embedding models
- Azure AI Search with semantic search capability
- Azure Storage Account for document storage
- Managed Identities and RBAC role assignments

## Parameters

The `main.bicep` file uses parameters defined in `main.parameters.json` for resource naming and configuration.

## Deployment

You can deploy the infrastructure using the Azure Developer CLI (azd):

```bash
azd provision
```

Or using Azure CLI directly:

```bash
az login
az group create --name <resource-group-name> --location <location>
az deployment group create --resource-group <resource-group-name> --template-file main.bicep --parameters main.parameters.json
```

## Post-deployment

After deployment, you'll need to:

1. Upload your documents to the Azure Storage Account
2. Process the documents into the Azure AI Search index
3. Deploy the Express.js application to the App Service
