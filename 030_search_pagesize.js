/**
 * @fileoverview Search products by a substring with different page sizes.
 */
const { SearchServiceClient } = require("@google-cloud/retail");

const {
  defaultBranch,
  defaultSearchPlacement,
  visitorId,
} = require("./setup_catalog.js");

const searchClient = new SearchServiceClient({
  apiEndpoint: "test-retail.sandbox.googleapis.com",
});

const MAX_RESULTS = 20;
const sampleQuery = "Dummy"; // experiment with other query strings
const tryPageSize = 4; // try different page sizes, including those over 100

// [START search for product defining page size]
async function searchProductWithPageSize() {
  const searchRequest = {
    branch: defaultBranch,
    offset: 0,
    pageToken: null,
    pageSize: tryPageSize,
    placement: defaultSearchPlacement,
    query: sampleQuery,
    visitorId: visitorId,
  };
  const searchResponse = await searchClient.search(searchRequest
    //, {
    // autoPaginate: true,
    // pageSize: tryPageSize,
  // }
  );
  const results = searchResponse[0];

  console.log(searchResponse);

  console.log(
    `First ${MAX_RESULTS} out of ${results.length} found at the page size of ${tryPageSize}:\n`,
    results
      .slice(0, MAX_RESULTS)
      .map((result, i) => `${i + 1}: ${result.product.title}`)
  );
}
// [END search for product defining page size]

searchProductWithPageSize();
