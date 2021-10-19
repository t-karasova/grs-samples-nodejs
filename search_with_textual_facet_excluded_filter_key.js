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

// [START search for product and return textual facets excluding filter key]
async function searchProductsWithTextualFacetExcludedFilterKeys() {
  const facetKey = {
    key: 'colorFamily',
  };
  const facetSpec = {
    facetKey: facetKey,
    excludedFilterKeys: ['colorFamily'],
  };
  const searchRequest = {
    facetSpec: facetSpec,
    filter: '(colorFamily: ANY("black"))',
    placement: defaultSearchPlacement,
    query: 'Nest_Maxi',
    visitorId: '123456',
  };
  const searchResponse = await searchClient.search(searchRequest);
  console.log('Search results with a textual facet excluding filter keys', searchResponse);
}
// [END search for product and return textual facets excluding filter key]

searchProductsWithTextualFacetExcludedFilterKeys();
