const { PredictionServiceClient } = require('@google-cloud/retail');

// Requires a credentials file to be referenced through the following environment variable
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './sa.json';

// [START config to replace with your values]
const apiEndpoint = 'test-retail.sandbox.googleapis.com';
const catalog = 'default_catalog';
const location = 'global';
const predictionProjectId = 370162036000;
// [END config to replace with your values]

const predictionClient = new PredictionServiceClient({ apiEndpoint });
const placement = `projects/${predictionProjectId}/locations/${location}/catalogs/${catalog}/placements/recently_viewed_default`;

// [START prepare product]
const product = {
    title: 'Nest_Maxi',
    type: 'PRIMARY',
    categories: ['Nest > speakers & displays'],
    brands: ['Google'],
    uri: 'http://www.test-uri.com'
};
// [END prepare product]

const productDetail = {
    product: product,
    quantity: {
        value: 2
    }
};

// [START prepare add-to-cart user event]
const detailPageViewUserEvent = {
    eventType: 'detail-page-view',
    visitorId: 'visitor_1',
    productDetails: [productDetail]
};
// [END prepare add-to-cart user event]

function printError(error) {
    console.log('Error: ', JSON.stringify(error, null, 2));
}

const param = {
    'returnProduct': {
        boolValue: true
    }
};

//[START get predictions using filter]
async function getPredictionWithFilter(userEvent, filter) {
    const prediction = await predictionClient.predict({
        placement: placement,
        userEvent: userEvent,
        filter: filter,
        params: param
    });
    return prediction[0]
}
//[END get predictions using filter]

//[START get predictions using pagination]
async function getPredictionWithPagination(userEvent, pageSize) {
    const prediction = await predictionClient.predict({ placement, userEvent, pageSize, params });
    return prediction[0]
}
//[END get predictions using pagination]

//[START get predictions using parameters]
async function getPredictionWithParameters(userEvent, params) {
    const prediction = await predictionClient.predict({ placement, userEvent, params });
    return prediction[0]
}
//[END get predictions using parameters]

//[START get predictions using labels]
async function getPredictionWithLabels(userEvent, labels) {
    const prediction = await predictionClient.predict({ placement, userEvent, labels, params: param });
    return prediction[0]
}
//[END get predictions using labels]


// 1. get predictions using filter
getPredictionWithFilter(detailPageViewUserEvent, 'tag = ("tag2" OR NOT "tag3")')
    .then(predictions => console.info('Predictions received using filter by tags: \n%s', JSON.stringify(predictions, null, 2)))
    .catch(printError);

// 2. get predictions using
getPredictionWithFilter(detailPageViewUserEvent, 'filterOutOfStockItems')
    .then(predictions => console.info('Predictions received using out_of_stock filter: \n%s', JSON.stringify(predictions, null, 2)))
    .catch(printError);

// 3. get predictions with pagination
getPredictionWithPagination(detailPageViewUserEvent, 2)
    .then(predictions => console.info('Predictions received with pagination: \n%s', JSON.stringify(predictions, null, 2)))
    .catch(printError);

// 4. get predictions with parameters
const parameters = {
    'returnProduct': { boolValue: true },
    'strictFiltering': { boolValue: false }
};
getPredictionWithParameters(detailPageViewUserEvent, parameters)
    .then(predictions => console.info('Predictions received with parameters: \n%s', JSON.stringify(predictions, null, 2)))
    .catch(printError);
