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

// [START search for product defining page size and offset]
async function searchProductWithPageSizeAndOffset() {
  const searchRequest = {
    pageSize: 4, // try different page sizes, including those over 100
    offset: 1, // try different offsets to see different products
    placement: defaultSearchPlacement,
    query: 'Nest_Maxi',
    visitorId: 'visitor',
  };
  const searchResponse = await searchClient.search(searchRequest, {
    autoPaginate: false,
  });
  console.log(searchResponse);
}
// [END search for product defining page size and offset]

searchProductWithPageSizeAndOffset();
