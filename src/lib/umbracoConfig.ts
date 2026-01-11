import { OpenAPI } from '@ihu/umbraco-components/dist/api/umbraco/core/OpenAPI';

OpenAPI.BASE = process.env.NEXT_APP_UMBRACO_BASE_URL || 'https://localhost:44352';
OpenAPI.HEADERS = {
  'Api-Key': process.env.NEXT_APP_UMBRACO_SITE_API_KEY || '',
  'Start-Item': process.env.NEXT_APP_UMBRACO_START_ITEM || ''
};

// This file should be imported anywhere Umbraco API is used to ensure global config
