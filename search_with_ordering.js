/**
 * @fileoverview Search products and order results.
 */
const { SearchServiceClient } = require('@google-cloud/retail');

// Requires a credentials file to be referenced through the following
// environment variable
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './sa.json';

const projectId = 'SET HERE VALID PROJECT NUMBER';

const defaultSearchPlacement = `projects/${projectId}/locations/global/catalogs/default_catalog/placements/default_search`;

const searchClient = new SearchServiceClient({
  apiEndpoint: 'test-retail.sandbox.googleapis.com',
});

// [START search for product using ordering]
async function searchAndOrderProducts() {
  const searchRequest = {
    placement: defaultSearchPlacement,
    orderBy: 'price desc',
    query: 'Hoodie',
    visitorId: '123456',
  };
  const searchResponse = await searchClient.search(searchRequest);
  console.log(`Search results ordered by price:\n`, searchResponse);
}
// [END search for product using ordering]

searchAndOrderProducts();