const { ProductServiceClient } = require('@google-cloud/retail');
const { SearchServiceClient } = require('@google-cloud/retail');
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

const options = { apiEndpoint };
const productClient = new ProductServiceClient(options);
const searchClient = new SearchServiceClient(options);

const defaultCatalog = `projects/${projectId}/locations/${location}/catalogs/${catalog}`;
const defaultSearchPlacement = `${defaultCatalog}/placements/default_search`;
const defaultBranch = `${defaultCatalog}/branches/${branch}`;
const visitorId = 'visitor';
const query_phrase = `Dummy Product ${Date.now()}`;
const INDEXING_DELAY_MS = 5000;
const DUMMY_CATEGORY = 'dummies > speakers & displays';

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

const fulfillmentInfoVariant = {
    type: 'pickup-in-store',
    placeIds: ['store2']
};

const fieldMask = {
    paths: ['name', 'title', 'price_info', 'color_info', 'brands']
};


// [START example primary product]
const primaryProductToCreate = {
    title: `Maxi ${query_phrase}`,
    type: 'PRIMARY',
    categories: [DUMMY_CATEGORY],
    brands: ['Google'],
    uri: 'http://www.test-uri.com',
    priceInfo: priceInfoPrimary,
    colorInfo: colorInfoPrimary,
    fulfillmentInfo: [fulfillmentInfoPrimary],
    retrievableFields: fieldMask
};

let createdPrimaryProduct;
// [END example primary product]

// [START example variant product]
const variantProductToCreate = {
    title: `Maxi ${query_phrase} variant`,
    type: 'VARIANT',
    categories: [DUMMY_CATEGORY],
    brands: ['Google'],
    uri: 'http://www.test-uri.com',
    fulfillmentInfo: [fulfillmentInfoVariant],
    retrievableFields: fieldMask
};
let createdVariantProduct;

// [END example variant product]

function printError(error) {
    console.log('Error: ', JSON.stringify(error, null, 2));
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


// [START create primary and related variant products for search]
async function createPrimaryAndVariantProductsForSearch(primaryProduct, variantProduct) {
    createProduct(uuidV4(), primaryProduct)
        .then(createdProduct => {
            createdPrimaryProduct = createdProduct;
            console.info('Created primary product: \n%s', JSON.stringify(createdProduct, null, 2));
            variantProduct.primaryProductId = createdPrimaryProduct.id;
            createProduct(uuidV4(), variantProduct)
                .then(createdVarProduct => {
                    createdVariantProduct = createdVarProduct;
                    console.info('Created variant product: \n%s', JSON.stringify(createdVarProduct, null, 2));
                });
        })
        //wait for created products get indexed for search
        .then(await sleep(INDEXING_DELAY_MS))
        .catch(printError);
}
// [END create primary and related variant products for search]

// [START search for product by query]
async function searchProduct(query) {
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product by query]

// [START search for product using filter]
async function searchProductWithFilter(query, filter) {
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        filter: filter,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product using filter]

// [START search for product defining page size]
async function searchProductWithPageSize(query, pageSize) {
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        pageSize: pageSize,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product defining page size]

// [START search for product defining page size and offset]
async function searchProductWithPageSizeAndOffset(query, pageSize, offset) {
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        pageSize: pageSize,
        offset: offset,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product defining page size and offset]

// [START search for product defining page size and next page token]
async function searchProductWithPageSizeAndNextPageToken(query, pageSize, nextPageToken) {
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        pageSize: pageSize,
        offset: nextPageToken,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product defining page size and next page token]

// [START search for product using ordering]
async function searchAndOrderProducts(query, orderBy) {
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        orderBy: orderBy,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product using ordering]

// [START search for product using boost specification]
async function searchProductsWithBoostSpec(query, condition, boost_score) {
    const boostSpec = {
        condition: condition,
        boost: boost_score
    };
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        boostSpec: boostSpec,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product using boost specification]

// [START search for product using query expansion specification]
async function searchProductsWithQueryExpansionSpec(query, condition) {
    const queryExpansionSpec = {
        condition: condition
    };
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        queryExpansionSpec: queryExpansionSpec,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product using query expansion specification]

// [START search for product and return textual facets]
async function searchProductsWithTextualFacet(query, key) {
    const facetKey = {
        key: key
    };
    const facetSpec = {
        facetKey: facetKey
    };
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        facetSpec: facetSpec,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product and return textual facets]

// [START search for product and return textual facets excluding filter key]
async function searchProductsWithTextualFacetExcludedFilterKeys(query, key, [excludedFilterKeys], filter) {
    const facetKey = {
        key: key
    };
    const facetSpec = {
        facetKey: facetKey,
        excludedFilterKeys: excludedFilterKeys
    };
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        filter: filter,
        facetSpec: facetSpec,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product and return textual facets excluding filter key]

// [START search for product and return textual facets restricting values]
async function searchProductsWithTextualFacetRestrictedValues(query, key, [restrictedValues]) {
    const facetKey = {
        key: key,
        restrictedValues: restrictedValues
    };
    const facetSpec = {
        facetKey: facetKey
    };
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        facetSpec: facetSpec,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product and return textual facets restricting values]

// [START search for product and return numerical facets]
async function searchProductsWithNumericalFacet(query, key, [intervals]) {
    const facetKey = {
        key: key,
        intervals: intervals
    };
    const facetSpec = {
        facetKey: facetKey
    };
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        facetSpec: facetSpec,
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [END search for product and return numerical facets]

// [START search for product with variant rollup keys]
async function searchProductsWithVariantRollupKeys(query, [variantRollupKeys]) {
    const searchRequest = {
        placement: defaultSearchPlacement,
        branch: defaultBranch,
        query: query,
        variantRollupKeys: [variantRollupKeys],
        visitorId: visitorId
    };
    const searchResponse = await searchClient.search(searchRequest);
    return searchResponse[0];
}
// [START search for product with variant rollup keys]

// 1. Create Primary and Variant products for search:
createPrimaryAndVariantProductsForSearch(primaryProductToCreate, variantProductToCreate)
    //2. search for product by only query:
    .then(() => searchProduct(query_phrase)
        .then(searchResult => console.info('search result for product by only query: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    //3. search using filter
    .then(() => searchProductWithFilter(query_phrase, 'colorFamily: ANY("black")')
        .then(searchResult => console.info('search result using filter: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    //4. search with page size
    .then(() => searchProductWithPageSize(query_phrase, 2)
        .then(searchResult => console.info('search result with page size: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    //5. search with page size and offset
    .then(() => searchProductWithPageSizeAndOffset(query_phrase, 1, 2)
        .then(searchResult => console.info('search result with page size and offset: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    //6. search with page size and nex page token
    .then(() => searchProductWithPageSize(query_phrase, 1)
        .then(searchResult => {
            searchProductWithPageSizeAndNextPageToken(query_phrase, 1, searchResult.nextPageToken)
                .then(response => console.info('search result with page size and nex page token: \n%s', JSON.stringify(searchResult[0], null, 2)))
                .catch(printError);
        })
        .catch(printError))
    //7. search and order products in response
    .then(() => searchAndOrderProducts(query_phrase, 'price desc')
        .then(searchResult => console.info('search result ordered by price: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    //8. search products with boost spec
    .then(() => searchProductsWithBoostSpec(query_phrase, 'color_family: ANY("blue")', 0.5)
        .then(searchResult => console.info('search result using boost spec: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    //9. search with query expansion spec
    .then(() => searchProductsWithQueryExpansionSpec(query_phrase, 'AUTO')
        .then(searchResult => console.info('search result using query expansion spec: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    //10. search products, return textual facet
    .then(() => searchProductsWithTextualFacet(query_phrase, 'colorFamily')
        .then(searchResult => console.info('search return textual facet: \n%s', JSON.stringify(searchResult.facets, null, 2)))
        .catch(printError))
    //11. search products, return numerical facet
    .then(() => {
        const interval = {
            minimum: 10.0,
            maximum: 20.0
        };
        searchProductsWithNumericalFacet(query_phrase, 'price', [interval])
            .then(searchResult => console.info('search return numerical facet: \n%s', JSON.stringify(searchResult.facets, null, 2)))
            .catch(printError);
    })
    //12. search products, return textual facet excluded filter keys
    .then(() => searchProductsWithTextualFacetExcludedFilterKeys(query_phrase, 'colorFamily', ['colorFamily'], 'colorFamily: ANY("black")')
        .then(searchResult => console.info('search return textual facet excluded filter keys: \n%s', JSON.stringify(searchResult.facets, null, 2)))
        .catch(printError))
    //13. search products, return textual facet restricted values
    .then(() => searchProductsWithTextualFacetRestrictedValues(query_phrase, 'colorFamily', ['black'])
        .then(searchResult => console.info('search return textual facet with restricted values: \n%s', JSON.stringify(searchResult.facets, null, 2)))
        .catch(printError))
    //14. search products, variant rollup keys
    .then(() => searchProductsWithVariantRollupKeys(query_phrase, ['shipToStore.store2'])
        .then(searchResult => console.info('search with variant rollup keys: \n%s', JSON.stringify(searchResult, null, 2)))
        .catch(printError))
    // delete created products:
    .then(() => {
        deleteProduct(createdVariantProduct.name)
            .then(() => {
                console.info('Variant product deleted');
                deleteProduct(createdPrimaryProduct.name)
                    .then(() => console.info('Primary product deleted'));
            });
    });
