/**
 * @fileoverview Search products with a textual facet
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

// [START search for product and return textual facets]
async function searchProductsWithTextualFacet() {
  const facetKey = { key: 'colorFamily' };
  const facetSpec = { facetKey: facetKey };
  const searchRequest = {
    facetSpec: facetSpec,
    placement: defaultSearchPlacement,
    query: 'Nest_Maxi',
    visitorId: 'visitor',
  };
  const searchResponse = await searchClient.search(searchRequest);
  console.log('Search results with a textual facet', searchResponse);
}
// [END search for product and return textual facets]

searchProductsWithTextualFacet();