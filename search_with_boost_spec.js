/**
 * @fileoverview Search products with a boost specification
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

// [START search for product using boost specification]
async function searchProductsWithBoostSpec() {
  const boostSpec = {
    condition: '(colorFamily: ANY("black"))', // try other condiitons
    boost: 0.1, // try different scores
  };
  const searchRequest = {
    boostSpec: boostSpec,
    placement: defaultSearchPlacement,
    query: 'Tee',
    visitorId: '123456',
  };
  const searchResponse = await searchClient.search(searchRequest);
  console.log('Search results with boost specification', searchResponse);
}
// [END search for product using boost specification]

searchProductsWithBoostSpec();
