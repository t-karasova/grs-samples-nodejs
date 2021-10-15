/**
 * @fileoverview Search products by a substring.
 */
const { SearchServiceClient } = require("@google-cloud/retail");

// Requires a credentials file to be referenced through the following
// environment variable
process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./sa.json";

const projectId = 1038874412926;

const defaultSearchPlacement = `projects/${projectId}/locations/global/catalogs/default_catalog/placements/default_search`;

const searchClient = new SearchServiceClient({
  apiEndpoint: "test-retail.sandbox.googleapis.com",
});

// [START search for product by query]
async function searchProduct() {
  const searchRequest = {
    placement: defaultSearchPlacement,
    query: "Nest", // try other strings
    visitorId: "visitor",
  };
  const searchResponse = await searchClient.search(searchRequest);

  console.log(searchResponse);
}
// [END search for product by query]

searchProduct();
