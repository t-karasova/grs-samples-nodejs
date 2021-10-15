const {ProductServiceClient} = require('@google-cloud/retail');
const { v4: uuidv4 } = require('uuid');

// Requires a credentials file to be referenced through the following environment variable
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './sa.json';

// [START config to replace with your values]
const branch = 'default_branch';
const catalog = 'default_catalog';
const location = 'global';
const projectId = 1038874412926;
// [END config to replace with your values]

const parentPath = `projects/${projectId}/locations/${location}/catalogs/${catalog}/branches/${branch}`;

// [START create product service client]
const client = new ProductServiceClient();
// [END create product service client]

// [START example product]
const product = {
    title: 'Product title',
    type: 'PRIMARY',
    categories: ['category> subcategory'],
    brands: ['brand'],
    uri: 'http://product-uri.com'
};
// [END example product]

// [START create product]
async function createProduct(id, productToCreate) {
    const createdProducts = await client.createProduct({
        parent: parentPath,
        productId: id,
        product: productToCreate
    });
    console.info('Created product: \n%s', JSON.stringify(createdProducts[0], null, 2));
    return createdProducts[0];
}
// [END create product]

// [START update product]
async function updateProduct(productToUpdate) {
    const updatedProduct = await client.updateProduct({
        product: productToUpdate,
        allowMissing: false
    });
    console.info('Updated product: \n%s', JSON.stringify(updatedProduct[0], null, 2));
    return updatedProduct[0];
}
// [END update product]

// [START upsert product]
async function upsertProduct(productToUpdate) {
    const updatedProduct = await client.updateProduct({
        product: productToUpdate,
        allowMissing: true
    });
    console.info('Upserted product: \n%s', JSON.stringify(updatedProduct[0], null, 2));
    return updatedProduct[0];
}
// [END upsert product]

// [START get product]
async function getProduct(name) {
    const product = await client.getProduct({name});
    console.info('Product: \n%s', JSON.stringify(product, null, 2));
    return product[0];
}
// [END get product]

// [START delete product]
async function deleteProduct(name) {
    await client.deleteProduct({
        name: name,
    });
    console.info('Product "%s" deleted successfully', name);
}
// [END delete product]

// [START list products]
async function listProducts(pageSize, nextPageToken, filter) {
    const products = await client.listProducts({
        parent: parentPath,
        pageSize: pageSize,
        pageToken: nextPageToken,
        filter: filter
    },{autoPaginate: false});
    console.info('Products: \n%s', JSON.stringify(products, null, 2));
    return products;
}
// [END list products]

// [START add fulfilment places]
async function addFulfilmentPlaces(productName, type, placeIds) {
    const timestamp = {timestamp: Date.now()};
    return await client.addFulfillmentPlaces({
        product: productName,
        type: type,
        placeIds: placeIds,
        addTime: timestamp
    });
}
// [END add fulfilment places]

// [START remove fulfilment places]
async function removeFulfilmentPlaces(productName, type, placeIds) {
    const timestamp = {timestamp: Date.now()};
    return await client.removeFulfillmentPlaces({
        product: productName,
        type: type,
        placeIds: placeIds,
        addTime: timestamp
    });
}
// [END remove fulfilment places]

// [START usage examples]
function printError(error){
    console.log('Error: ', JSON.stringify(error, null, 2));
}

// 1. Create primary and variant products
createProduct(uuidv4(), product)
    .then(createdProduct => {
        let variantProduct = product;
        variantProduct['primaryProductId'] = createdProduct.id;
        variantProduct['type'] = 'VARIANT';
        return createProduct(uuidv4(), variantProduct);
    })
    .catch(printError);

// 2. Create and delete product
createProduct(uuidv4(), product)
    .then(createdProduct => deleteProduct(createdProduct.name))
    .catch(printError);

// 3. Create and update, then delete product
createProduct(uuidv4(), product)
    .then(createdProduct => {
        let updatedProduct = createdProduct;
        updatedProduct['title'] = 'Updated product title';
        updatedProduct['brands'] = ['new brand', 'other brand'];
        return updateProduct(updatedProduct);
    })
    .then(updatedProduct => deleteProduct(updatedProduct.name))
    .catch(printError);

// 4. List product
listProducts(10, '', '')
    .catch(printError);
// [END usage examples]