// Copyright 2021 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

async function main(generatedProductId) {
  // [START retail_remove_fulfillment_places]

  // Imports the Google Cloud client library.
  const {ProductServiceClient} = require('@google-cloud/retail').v2;
  const utils = require('../setup/setup_cleanup');

  const projectNumber = process.env['PROJECT_NUMBER'];
  const apiEndpoint = 'retail.googleapis.com';

  // Create product
  const createdProduct = await utils.createProduct(
    projectNumber,
    generatedProductId,
    true
  );

  // Full resource name of Product
  const product = createdProduct.name;

  // The fulfillment type, including commonly used types (such as
  // pickup in store and same day delivery), and custom types.
  const type = 'same-day-delivery';

  // The IDs for this type, such as the store IDs for "pickup-in-store" or the region IDs for
  // "same-day-delivery" to be added for this type.
  const placeIds = ['store1', 'store2'];

  // The time when the fulfillment updates are issued, used to prevent
  // out-of-order updates on fulfillment information.
  const removeTime = {
    seconds: Math.round(Date.now() / 1000),
  };

  // Instantiates a client.
  const retailClient = new ProductServiceClient({apiEndpoint});

  const callRemoveFulfillmentPlaces = async () => {
    // Construct request
    const request = {
      product,
      type,
      placeIds,
      removeTime,
    };

    console.log('Remove fulfillment request:', request);
    // Run request
    await retailClient.removeFulfillmentPlaces(request);

    console.log('Waiting to complete remove operation..');
  };

  // Remove fulfillment places
  console.log('Start remove fulfillment');
  await callRemoveFulfillmentPlaces();
  await utils.delay(50000);
  console.log('Remove fulfillment finished');

  //Get product
  const response = await utils.getProduct(product);
  console.log('Updated product: ', JSON.stringify(response[0]));

  // Delete product
  await utils.deleteProduct(product);
  console.log(`Product ${createdProduct.id} deleted`);
  // [END retail_remove_fulfillment_places]
}

process.on('unhandledRejection', err => {
  console.error('ERROR', err.message);
  process.exitCode = 1;
});

main(...process.argv.slice(2));
