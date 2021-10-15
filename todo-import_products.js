const { ProductServiceClient } = require('@google-cloud/retail');
const { v4: uuidV4 } = require('uuid');

// Requires a credentials file to be referenced through the following environment variable
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './sa.json';

// [START config to replace with your values]
const apiEndpoint = 'test-retail.sandbox.googleapis.com';
const branch = '0';
const catalog = 'default_catalog';
const location = 'global';
const projectId = 1038874412926;

const bqProjectId = 'cloud-ai-retail-search-test';
const bqDatasetId = 'INTEGRATION_TESTS';
const bqTableId = 'v2alpha_inventory';

const gcsBucket = 'gs://cloud-ai-retail-search-test-products/products';
const gcsErrorBucket = 'gs://cloud-ai-retail-search-test-errors/errors';
const gcsProductObject = 'data_bulk_import.json';
// [END config to replace with your values]

const productClient = new ProductServiceClient({ apiEndpoint });

const defaultCatalog = `projects/${projectId}/locations/${location}/catalogs/${catalog}/branches/${branch}`;

function printError(error) {
    console.log('Error: ', JSON.stringify(error, null, 2));
}

const timestamp = {
    seconds: Date.now() / 1000 | 0
};

const priceInfoPrimary = {
    price: 20.0,
    originalPrice: 25.0,
    cost: 10.0,
    currencyCode: 'USD'
};

const colorInfoPrimary = {
    colorFamilies: ['black'],
    colors: ['carbon']
};

const fulfillmentInfoPrimary = {
    type: 'pickup-in-store',
    placeIds: ['store1', 'store2']
};

const fieldMask = {
    paths: ['name', 'title', 'price_info', 'color_info', 'brands']
};

// [START example primary product]
const primaryProductToCreate = {
    id: uuidV4(),
    title: 'Some Dummy Product',
    type: 'PRIMARY',
    categories: ['dummies > speakers & displays'],
    brands: ['Google'],
    uri: 'http://www.test-uri.com',
    priceInfo: priceInfoPrimary,
    colorInfo: colorInfoPrimary,
    fulfillmentInfo: [fulfillmentInfoPrimary],
    retrievableFields: fieldMask
};
// [END example primary product]

// [START prepare input config for importing from inline source]
const inputConfigInlineSource = {
    productInlineSource: {
        products: [primaryProductToCreate]
    }
};
// [END prepare input config for importing from inline source]

// [START prepare input config for importing from GCS]
const inputConfigGcs = {
    gcsSource: {
        inputUris: [gcsBucket + '/' + gcsProductObject],
        dataSchema: 'product'
    }
};
// [END prepare input config for importing from GCS]

// [START prepare input config for importing from BigQueryTable]
const inputConfigBq = {
    bigQuerySource: {
        projectId: bqProjectId,
        datasetId: bqDatasetId,
        tableId: bqTableId,
        dataSchema: 'product'
    }
};
// [END prepare input config for importing from BigQueryTable]

// [START prepare error config for importing from GCS]
const errorConfig = {
    gcsPrefix: gcsErrorBucket
};
// [END prepare error config for importing from GCS]


// [START import products]
async function importProducts(inputConfig, errorConfig) {
    const operation = await productClient.importProducts({
        parent: defaultCatalog,
        requestId: uuidV4(),
        inputConfig: inputConfig,
        errorsConfig: errorConfig
    });
    return operation[0];
}
// [END import products]


// import products from inline source:
importProducts(inputConfigInlineSource, null)
    .then(operation => console.info('Operation for product import from the inline source: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);

// import products form BigQuery table
importProducts(inputConfigBq, null)
    .then(operation => console.info('Operation for product import from the BQ source: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);

//import products from GCS
importProducts(inputConfigGcs, errorConfig)
    .then(operation => console.info('Operation for product import from the GCS source: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);
