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
// [END config to replace with your values]

const productClient = new ProductServiceClient({ apiEndpoint });
const defaultCatalog = `projects/${projectId}/locations/${location}/catalogs/${catalog}/branches/${branch}`;

function printError(error) {
    console.log('Error: ', JSON.stringify(error, null, 2));
}

const timestamp = {
    seconds: Math.round(Date.now() / 1000)
};

const priceInfoOriginal = {
    price: 20.0,
    originalPrice: 25.0,
    cost: 10.0,
    currencyCode: 'USD'
};

const priceInfoUpdated = {
    price: 19.0,
    originalPrice: 24.0,
    cost: 11.0,
    currencyCode: 'EUR'
};


const fulfillmentInfoOriginal = {
    type: 'pickup-in-store',
    placeIds: ['store1', 'store2']
};

const fulfillmentInfoUpdated = {
    type: 'same-day-delivery',
    placeIds: ['store3', 'store4']
};


const setMask = {
    paths: ['price_info', 'availability', 'available_quantity', 'fulfillment_info']
};

// [START example primary product]
const productCommon = {
    title: `Dummy Product ${Date.now()}`,
    type: 'PRIMARY',
    categories: ['dummies > speakers & displays'],
    brands: ['Google'],
    uri: 'http://www.test-uri.com',
};

const originalProductToCreate = {
    ...productCommon,
    priceInfo: priceInfoOriginal,
    availability: 'OUT_OF_STOCK',
    availableQuantity: {
        value: 25
    },
    fulfillmentInfo: [fulfillmentInfoOriginal]
};

const productToUpdate = {
    ...productCommon, 
    priceInfo: priceInfoUpdated,
    availability: 'IN_STOCK',
    availableQuantity: {
        value: 50
    },
    fulfillmentInfo: [fulfillmentInfoUpdated]
};

async function createProduct(product) {
    const createdProduct = await productClient.createProduct({
        parent: defaultCatalog,
        productId: uuidV4(),
        product
    });
    return createdProduct[0];
}

async function deleteProduct(name) {
    await productClient.deleteProduct({ name })
}

async function setInventory(product, setMask) {
    const operation = await productClient.setInventory({
        inventory: product,
        setMask,
        setTime: timestamp,
        allowMissing: true
    });
    return operation[0];
}

createProduct(originalProductToCreate)
    .then(origanalProduct => {
        console.info('Original product: \n%s', JSON.stringify(origanalProduct, null, 2));
        productToUpdate.name = origanalProduct.name;
        setInventory(productToUpdate, setMask)
            .then(operation => console.info('Operation name for set inventory request: \n%s', JSON.stringify({...operation, longrunningDescriptor: ''}, null, 2)))
            .catch(printError);
        deleteProduct(origanalProduct.name)
            .catch(printError)
    });
