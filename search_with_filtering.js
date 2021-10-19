/**
 * @fileoverview Search products by a substring and a filter.
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

const sampleFilter = '(colorFamily: ANY("black"))'; // experiment with filters

// [START search for product using filter]
async function searchProductWithFilter() {
  const searchRequest = {
    filter: sampleFilter,
    placement: defaultSearchPlacement,
    query: 'Tee',
    visitorId: '123456',
  };

  const searchResponse = await searchClient.search(searchRequest);
  console.log(searchResponse);
}
// [END search for product using filter]

searchProductWithFilter();
