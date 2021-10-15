/**
 * @fileoverview Search products by a substring.
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

const MAX_RESULTS = 10;
const sampleQuery = 'Single'; // try to experiment with other strings

// [START search for product by query]
async function searchProduct() {

  const searchRequest = {
    placement: defaultSearchPlacement,
    branch: defaultBranch,
    query: sampleQuery,
    visitorId: visitorId,
  };
  const searchResponse = await searchClient.search(searchRequest);

  const results = searchResponse[0];
  console.log(
    `First ${MAX_RESULTS} out of ${results.length} products found with query "${searchRequest.query}":\n`,
    results
      .slice(0, MAX_RESULTS)
      .map((result, i) => `${i + 1}: ${result.product.title}`)
  );


}
// [END search for product by query]

searchProduct();
