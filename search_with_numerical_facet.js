/**
 * @fileoverview Search products with a numerical facet
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

// [START search for product and return numerical facets]
async function searchProductsWithNumericalFacet() {
  const interval = {
    minimum: 10.0,
    maximum: 20.0,
  };
  const facetKey = {
    key: 'price',
    intervals: [interval],
  };
  const facetSpec = {
    facetKey: facetKey,
  };
  const searchRequest = {
    facetSpec: facetSpec,
    placement: defaultSearchPlacement,
    query: 'Nest_Maxi',
    visitorId: 'visitor',
  };
  const searchResponse = await searchClient.search(searchRequest);
  console.log('Search results with a numerical facet', searchResponse);
}
// [END search for product and return numerical facets]

searchProductsWithNumericalFacet();
