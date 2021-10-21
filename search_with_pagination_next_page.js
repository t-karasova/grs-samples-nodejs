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

  // [START search for product defining page size]
async function searchProductWithPageSizeAndNextPageToken() {
  const searchRequest = {
    pageSize: 6, // try different page sizes, including those over 100
    placement: defaultSearchPlacement,
    query: 'Tee', // experiment with other query strings
    visitorId: '123456',
  };
  let searchResponse = await searchClient.search(searchRequest, {
    autoPaginate: false,
  });
  console.log(`Products found on the first page:\n`, searchResponse);

  searchRequest.pageToken = searchResponse[2].nextPageToken;
  console.log('Search request:', searchRequest, {
    autoPaginate: false,
  });
  searchResponse = await searchClient.search(searchRequest, {
    autoPaginate: false,
  });
  console.log(`Products found on the next page:\n`, searchResponse);
}
// [END search for product defining page size]

searchProductWithPageSizeAndNextPageToken();
