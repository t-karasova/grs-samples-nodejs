const { CatalogServiceClient } = require('@google-cloud/retail');

// Requires a credentials file to be referenced through the following environment variable
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './sa.json';

// [START config to replace with your values]
const apiEndpoint = 'test-retail.sandbox.googleapis.com';
const catalog = 'default_catalog';
const location = 'global';
const projectId = 1038874412926;
// [END config to replace with your values]

const catalogClient = new CatalogServiceClient({ apiEndpoint });

const catalogParent = `projects/${projectId}/locations/${location}`;
const defaultCatalog = `${catalogParent}/catalogs/${catalog}`;

const fieldMask = {
    paths: ['product_level_config.ingestion_product_type']
};

const catalogToUpdate = {
    name: defaultCatalog,
    displayName: 'Updated product catalog',
    productLevelConfig: {
        ingestionProductType: 'primary',
        merchantCenterProductIdField: 'offer_id'
    }
};

function printError(error) {
    console.log(JSON.stringify(error, null, 2));
}

//[START get default branch]
async function getDefaultBranch(catalog) {
    const defaultBranch = await catalogClient.getDefaultBranch({ catalog });
    return defaultBranch[0]
}
//[EMD get default branch]


//[START set default branch]
async function setDefaultBranch(catalog, branchId) {
    await catalogClient.setDefaultBranch({ catalog, branchId, note: 'note' })
}
//[END set default branch]

//[START list catalog]
async function listCatalog(parent, pageSize) {
    const listCatalogResponse = await catalogClient.listCatalogs({ parent, pageSize });
    return listCatalogResponse[0]
}
//[END list catalog]

//[START update catalog]
async function updateCatalog(catalog, updateMask) {
    const updatedCatalog = await catalogClient.updateCatalog({ catalog, updateMask });
    return updatedCatalog[0]
}
//[END update catalog]



//1. get default branch
getDefaultBranch(defaultCatalog)
    .then(response => {
        console.info('Get default branch request: \n%s', JSON.stringify(response.branch, null, 2));
        //2. set default branch
        setDefaultBranch(defaultCatalog, 1).catch(printError)
            .then(() => getDefaultBranch(defaultCatalog)
                .then(updatedBranch => {
                    console.info('updated default branch request: \n%s', JSON.stringify(updatedBranch.branch, null, 2));
                    setDefaultBranch(defaultCatalog, response.branch).catch(printError)
                }));
    });

//4. list catalog
listCatalog(catalogParent, 3)
    .then(response => console.info('list catalog response: \n%s', JSON.stringify(response, null, 2)));

//5. update catalog
updateCatalog(catalogToUpdate, fieldMask)
    .then(response => console.info('updated catalog: \n%s', JSON.stringify(response, null, 2)));