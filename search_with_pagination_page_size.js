/**
 * @fileoverview Search products by a substring with different page sizes.
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

// [START search for product defining page size]
async function searchProductWithPageSize() {
  const searchRequest = {
    pageSize: 12, // try different page sizes
    placement: defaultSearchPlacement,
    query: 'Hoodie',
    visitorId: '123456',
  };
  const searchResponse = await searchClient.search(searchRequest, {
    autoPaginate: false,
  });
  console.log(searchResponse);
}
// [END search for product defining page size]

searchProductWithPageSize();
