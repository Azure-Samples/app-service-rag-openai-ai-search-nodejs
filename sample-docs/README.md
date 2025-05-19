# Sample Documents for Contoso, Ltd. RAG Application

This directory contains sample documents that can be used to demonstrate the Retrieval Augmented Generation (RAG) capabilities of Azure OpenAI on Your Data.

## Document Overview

1. **contoso-electronics.md** - Product catalog and company information
2. **contoso-support.md** - Support services and contact information
3. **contoso-faq.md** - Frequently asked questions about products and services
4. **contoso-privacy-policy.md** - Privacy policy and data handling practices
5. **contoso-warranty.md** - Warranty terms and conditions for products

## Using These Documents

These sample documents are designed to be uploaded to Azure AI Search for indexing and vectorization with Azure OpenAI. After deployment, follow these steps to set up your RAG system:

### Uploading via Azure Portal

1. Navigate to your Azure AI Search resource in the Azure Portal
2. Select "Import data" from the overview page
3. Choose "Upload files" as the data source
4. Upload the Markdown files from this directory
5. Configure the indexing options:
   - Select chunking settings appropriate for your use case
   - Enable vector search
   - Connect to your Azure OpenAI service
   - Select an appropriate embedding model (e.g., text-embedding-ada-002)
6. Complete the wizard to create your search index

### Testing RAG Functionality

After the documents have been indexed, you can test the RAG functionality with queries like:

- "What is Contoso's return policy?"
- "How long is the warranty on Contoso smartphones?"
- "How do I reset my Contoso smartphone?"
- "What does Contoso do with my personal information?"
- "Can I purchase extended warranty for my laptop?"

## Customizing Documents

You can modify these documents or add your own to better suit your demonstration needs. When creating new documents, consider:

1. Using clear section headers (with Markdown `#`, `##`, etc.)
2. Including specific details that can be retrieved
3. Structuring content in a question-answer format where appropriate
4. Maintaining a consistent format across documents

## Next Steps

After uploading and indexing these documents, configure your Azure OpenAI service to use the AI Search index as a data source for the completion API. This will enable your application to generate responses grounded in the content of these documents.
