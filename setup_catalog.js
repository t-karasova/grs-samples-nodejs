/**
 * @fileoverview A utility class to create dummy products. Will be obsolete once
 * a demo catalog is setup to acoompany the samples.
 */
const { ProductServiceClient } = require("@google-cloud/retail");
const { v4: uuidV4 } = require("uuid");

// Requires a credentials file to be referenced through the following
// environment variable
process.env["GOOGLE_APPLICATION_CREDENTIALS"] = "./sa.json";

// [START config to replace with your values]
const apiEndpoint = "test-retail.sandbox.googleapis.com";
const branch = "default_branch";
const catalog = "default_catalog";
const location = "global";
const projectId = 1038874412926;
// [END config to replace with your values]

const parentPath = `projects/${projectId}/locations/${location}/catalogs/${catalog}/branches/${branch}`;

const options = { apiEndpoint };

// [START create product service client]
const productClient = new ProductServiceClient(options);
// [END create product service client]

const defaultCatalog = `projects/${projectId}/locations/${location}/catalogs/${catalog}`;
const defaultSearchPlacement = `${defaultCatalog}/placements/default_search`;
const defaultBranch = `${defaultCatalog}/branches/${branch}`;
const visitorId = "visitor";

const query_phrase = `Dummy Product ${Date.now()}`;
const DUMMY_CATEGORY = "dummies > speakers & displays";

const priceInfoPrimary = {
  price: 20.0,
  originalPrice: 25.0,
  cost: 10.0,
  currencyCode: "USD",
};

const colorInfoPrimary = {
  colorFamilies: ["black"],
  colors: ["carbon"],
};

const fulfillmentInfoPrimary = {
  type: "pickup-in-store",
  placeIds: ["store1", "store2"],
};

const fulfillmentInfoVariant = {
  type: "pickup-in-store",
  placeIds: ["store2"],
};

const fieldMask = {
  paths: ["name", "title", "price_info", "color_info", "brands"],
};

// [START example primary product]
const primaryProductToCreate = {
  title: `Maxi ${query_phrase}`,
  type: "PRIMARY",
  categories: [DUMMY_CATEGORY],
  brands: ["Google"],
  uri: "http://www.test-uri.com",
  priceInfo: priceInfoPrimary,
  colorInfo: colorInfoPrimary,
  fulfillmentInfo: [fulfillmentInfoPrimary],
  retrievableFields: fieldMask,
};

let createdPrimaryProduct;
// [END example primary product]

// [START example variant product]
const variantProductToCreate = {
  title: `Maxi ${query_phrase} variant`,
  type: "VARIANT",
  categories: [DUMMY_CATEGORY],
  brands: ["Google"],
  uri: "http://www.test-uri.com",
  fulfillmentInfo: [fulfillmentInfoVariant],
  retrievableFields: fieldMask,
};
let createdVariantProduct;

// [END example variant product]

const INDEXING_DELAY_MS = 5000;

const primaryProductsToCleanUp = [];
const variantProductsToCleanUp = [];

function printError(error, prefix = "Error") {
  console.error(`${prefix}: `, error);
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// [START create product]
async function createProduct(id, productToCreate) {
  var createdProduct;
  try {
    [createdProduct] = await productClient.createProduct({
      parent: defaultBranch,
      productId: id,
      product: productToCreate,
    });
  } catch (error) {
    printError(
      error,
      `Error creating product with id '${id}', title: '${productToCreate.title}'`
    );
  }

  return createdProduct;
}
// [END create product]

// [START delete product]
async function deleteProduct(name) {
  const prodClient = new ProductServiceClient();
  console.log("Deleting product:", name);
  await prodClient.deleteProduct({ name: name });
  console.info("Deleted", name);
}
// [END delete product]

// [START create primary and related variant products for search]
async function createPrimaryAndVariantProductsForSearch() {
  console.log("Create dummy products...");
  try {
    const createdPrimaryProduct = await createProduct(
      uuidV4(),
      primaryProductToCreate
    );
    console.info("Created primary product: ", createdPrimaryProduct.name);
    primaryProductsToCleanUp.push(createdPrimaryProduct.name);

    const variantProduct = {
      ...variantProductToCreate,
      primaryProductId: createdPrimaryProduct.id,
    };
    const createdVariantProduct = await createProduct(uuidV4(), variantProduct);
    variantProductsToCleanUp.push(createdVariantProduct.name);
    console.info("Created variant product: ", createdVariantProduct.name);

    for (let p = 1; p <= 2; p++) {
      const createdExtraProduct = await createProduct(uuidV4(), {
        ...primaryProductToCreate,
        title: `${primaryProductToCreate.title}-${p}`,
      });
      primaryProductsToCleanUp.push(createdExtraProduct.name);

      console.log(
        "Created extra product: ",
        createdExtraProduct.title,
        createdExtraProduct.name
      );
    }
  } catch (error) {
    printError(error, "Error creating a set of dummy products");
  }

  await sleep(INDEXING_DELAY_MS); // wait for created products get indexed for search
}
// [END create primary and related variant products for search]

async function cleanUpCatalog() {
  for (const productName of variantProductsToCleanUp) {
    try {
      await deleteProduct(productName);
    } catch (error) {
      printError(
        error,
        `Error cleaning up catalog on variant product: ${productName}`
      );
    }
  }
  for (const productName of primaryProductsToCleanUp) {
    try {
      await deleteProduct(productName);
    } catch (error) {
      printError(error, `Error cleaning up catalog on product: ${productName}`);
    }
  }
}

function mockSetup() {
  console.log("Mock setup");
}

module.exports = {
  cleanUpCatalog,
  createPrimaryAndVariantProductsForSearch,
  defaultBranch,
  defaultSearchPlacement,
  deleteProduct,
  mockSetup,
  query_phrase,
  visitorId,
};
