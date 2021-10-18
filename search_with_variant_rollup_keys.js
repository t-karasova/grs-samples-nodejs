/**
 * @fileoverview Search products with a textual facet excluding filter keys
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

// [START search for product with variant rollup keys]
async function searchProductsWithVariantRollupKeys() {
  const searchRequest = {
    placement: defaultSearchPlacement,
    query: 'Nest_Maxi',
    variantRollupKeys: ['shipToStore.store2'],
    visitorId: 'visitor',
  };
  const searchResponse = await searchClient.search(searchRequest);
  console.log('Search results with variant rollup keys', searchResponse);
}
// [END search for product with variant rollup keys]

searchProductsWithVariantRollupKeys();
