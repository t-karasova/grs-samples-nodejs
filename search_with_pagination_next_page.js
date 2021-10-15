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

function searchProductWithPageSizeAndNextPageToken() {
  // [START search for product defining page size]
  const searchRequest = {
    pageSize: 4, // try different page sizes, including those over 100
    placement: defaultSearchPlacement,
    query: 'Nest_Maxi', // experiment with other query strings
    visitorId: 'visitor',
  };
  let searchResponse = await searchClient.search(searchRequest);
  console.log(`Products found on the first page:\n`, searchResponse[0]);

  searchRequest.pageToken = searchResponse.nextPageToken;
  console.log('Search request:', searchRequest);
  searchResponse = await searchClient.search(searchRequest);
  console.log(`Products found on the next page:\n`, searchResponse[0]);
}
// [END search for product defining page size]

searchProductWithPageSizeAndNextPageToken();
