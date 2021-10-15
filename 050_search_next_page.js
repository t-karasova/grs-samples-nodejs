/**
 * @fileoverview Search products by a substring and a filter.
 */
const { SearchServiceClient } = require("@google-cloud/retail");

const {
  cleanUpCatalog,
  defaultBranch,
  defaultSearchPlacement,
  createPrimaryAndVariantProductsForSearch,
  query_phrase,
  visitorId,
} = require("./setup_catalog.js");

const searchClient = new SearchServiceClient({
  apiEndpoint: "test-retail.sandbox.googleapis.com",
});

// [START search for product defining page size]
async function searchProductWithPageSizeAndNextPageToken() {
  const tryPageSize = 1;
  const searchRequest = {
    branch: defaultBranch,
    pageSize: tryPageSize, // try different page sizes, including those over 100
    placement: defaultSearchPlacement,
    query: query_phrase, // experiment with other query strings
    visitorId: visitorId,
  };
  let searchResponse = await searchClient.search(searchRequest);
  console.log(`Products found on the first page:\n`, searchResponse[0]);

  searchRequest.offset = searchResponse[0].nextPageToken;
  console.log('Search request:', searchRequest);
  searchResponse = await searchClient.search(searchRequest);
  console.log(`Products found on the next page:\n`, searchResponse[0]);

  await cleanUpCatalog();  // TODO: remove when a sample database is setup
}
// [END search for product defining page size]

searchProductWithPageSizeAndNextPageToken();
