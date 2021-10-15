const { UserEventServiceClient } = require('@google-cloud/retail');

// Requires a credentials file to be referenced through the following environment variable
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './sa.json';

// [START config to replace with your values]
const apiEndpoint = 'test-retail.sandbox.googleapis.com';
const catalog = 'default_catalog';
const location = 'global';
const projectId = 1038874412926;
const bqProjectId = 'cloud-ai-retail-search-test';
const bqDatasetId = 'INTEGRATION_TESTS';
const bqTableId = 'v2alpha_userevents';

const gcsBucket = 'gs://cloud-ai-retail-search-test-user-events';
const gcsErrorBucket = 'gs://cloud-ai-retail-search-test-user-events-errors/errors';
const gcsUserEventsObject = 'user_events_for_import.json';
// [END config to replace with your values]

const userEventServiceClient = new UserEventServiceClient({apiEndpoint});

const defaultCatalog = `projects/${projectId}/locations/${location}/catalogs/${catalog}`;

function printError(error) {
    console.log('Error: ', JSON.stringify(error, null, 2));
}

const timestamp = {
    seconds: Math.round(Date.now() / 1000)
};

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
    product,
    quantity: {
        value: 2
    }
};

// [START prepare add-to-cart user event]
const addToCartUserEvent = {
    eventType: 'add-to-cart',
    visitorId: 'visitor_1',
    cartId: 'cart_1',
    productDetails: [productDetail]
};
// [END prepare add-to-cart user event]

// [START prepare home-page-view user event]
const userEvent = {
    eventType: 'home-page-view',
    visitorId: 'visitorId',
    eventTime: timestamp
};
// [END prepare home-page-view user event]

// [START prepare input config for importing from inline source]
const inputConfigInlineSource = {
    userEventInlineSource: {
        userEvents: [userEvent]
    }
};
// [END prepare input config for importing from inline source]

// [START prepare input config for importing from GCS]
const inputConfigGcs = {
    gcsSource: {
        inputUris: [gcsBucket + '/' + gcsUserEventsObject],
        dataSchema: 'user_event'
    }
};
// [END prepare input config for importing from GCS]

// [START prepare input config for importing from BigQueryTable]
const inputConfigBq = {
    bigQuerySource: {
        projectId: bqProjectId,
        datasetId: bqDatasetId,
        tableId: bqTableId,
        dataSchema: 'user_event'
    }
};
// [END prepare input config for importing from BigQueryTable]

// [START prepare error config for importing from GCS]
const errorConfig = {
    gcsPrefix: gcsErrorBucket
};
// [END prepare error config for importing from GCS]

// [START write user event]
async function writeUserEvent(userEvent) {
    const writeUserEventRequest = {
        parent: defaultCatalog,
        userEvent
    };
    const userEventCreated = await userEventServiceClient.writeUserEvent(writeUserEventRequest);
    return userEventCreated[0];
}
// [END write user event]

// [START purge user event]
async function purgeUserEvents(filter, forceValue) {
    const purgeUserRequest = {
        parent: defaultCatalog,
        filter,
        force: forceValue
    };
    console.info('Purge user events request: \n%s', JSON.stringify(purgeUserRequest, null, 2));
    const operation = await userEventServiceClient.purgeUserEvents(purgeUserRequest);
    return operation[0];
}
// [END purge user event]

// [START rejoin user event]
async function rejoinUserEvents(rejoinScope) {
    const rejoinUserEvents = {
        parent: defaultCatalog,
        userEventRejoinScope: rejoinScope
    };
    console.info('Rejoin user events request: \n%s', JSON.stringify(rejoinUserEvents, null, 2));
    const operation = await userEventServiceClient.rejoinUserEvents(rejoinUserEvents);
    return operation[0];
}
// [END rejoin user event]

// [START import user event]
async function importUserEvents(inputConfig, errorsConfig) {
    const operation = await userEventServiceClient.importUserEvents({
        parent: defaultCatalog,
        inputConfig,
        errorsConfig
    });
    return operation[0];
}
// [END import user event]

// write user event:
writeUserEvent(addToCartUserEvent)
    .then(userEvent => console.info('written user event: \n%s', JSON.stringify(userEvent, null, 2)))
    .catch(printError);

// import user events from inline source:
importUserEvents(inputConfigInlineSource, null)
    .then(operation => console.info('Operation for importing user events from inline source: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);

// import user events form BigQuery table
importUserEvents(inputConfigBq, null)
    .then(operation => console.info('Operation for importing user events from BQ source: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);

//import user events from GCS
importUserEvents(inputConfigGcs, errorConfig)
    .then(operation => console.info('Operation for importing user events from GCS source: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);

//purge user events
purgeUserEvents('eventType = "home-page-view"', true)
    .then(operation => console.info('Operation for purging user events: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);

//rejoin user events
rejoinUserEvents('UNJOINED_EVENTS')
    .then(operation => console.info('Operation for rejoining user events: \n%s', JSON.stringify(operation.name, null, 2)))
    .catch(printError);