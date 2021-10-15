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

// [START search for product defining page size and offset]
async function searchProductWithPageSizeAndOffset() {
  const tryPageSize = 2;
  const tryOffset = 1;
  const searchRequest = {
    branch: defaultBranch,
    pageSize: tryPageSize, // try different page sizes, including those over 100
    offset: tryOffset,
    placement: defaultSearchPlacement,
    query: query_phrase, // experiment with other query strings
    visitorId: visitorId,
  };
  const searchResponse = await searchClient.search(searchRequest);
  console.log(
    `First of the products found at the page size of ${tryPageSize}, offset ${tryOffset}:\n`,
    searchResponse[0]
  );
}
// [END search for product defining page size and offset]

searchProductWithPageSizeAndOffset();
