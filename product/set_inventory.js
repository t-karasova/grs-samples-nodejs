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

async function main() {
  // [START retail_set_inventory]

  // Imports the Google Cloud client library.
  const { ProductServiceClient } = require('@google-cloud/retail').v2;
  const utils = require('./setup_cleanup');

  const projectId = process.env['PROJECT_NUMBER'];

  // Create product
  const product = await utils.createProduct(projectId);

  // The inventory information to update
  const inventory = {
    id: product.id,
    name: product.name,
    priceInfo: {
      price: 15.0,
      originalPrice: 20.0,
      cost: 8.0,
      currencyCode: "USD"
    },
    fulfillmentInfo: [{
      type: 'same-day-delivery',
      placeIds: ['store3', 'store4']
    }],
    availableQuantity: {
      value: 2
    },
    availability: 'IN_STOCK'
  };

  // Indicates which inventory fields in the provided product to update
  const setMask = {};

  // The time when the request is issued, used to prevent
  // out-of-order updates on inventory fields with the last update time recorded.
  const setTime = { 
    //seconds: Math.round(Date.now() / 1000) 
  };

  // If set to true, and the product with name is not found, the
  // inventory update will still be processed and retained for at most 1 day until the product is created
  const allowMissing = true;

  // Instantiates a client.
  const retailClient = new ProductServiceClient();

  const callSetInventory = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Construct request
        const request = {
          inventory,
          setMask,
          setTime,
          allowMissing
        };
    
        // Run request
        const operation = await retailClient.setInventory(request);
        console.log(operation);

        resolve()
      } catch (err) {
        reject(err);
      }
    });
  }

  // Set inventory
  await callSetInventory();

  // Delete product
  await utils.deleteProduct(product.name);
  // [END retail_set_inventory]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
