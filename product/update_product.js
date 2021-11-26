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
  // [START retail_update_product]

  // Imports the Google Cloud client library.
  const { ProductServiceClient } = require('@google-cloud/retail').v2;
  const utils = require('./setup_cleanup');

  const projectId = process.env['PROJECT_NUMBER'];

  // Create product
  const createdProduct = await utils.createProduct(projectId);

  // The ID to use for the product
  const productId = createdProduct?.id;

  // The parent catalog resource name
  const name = createdProduct?.name;

  // The product to update.
  const product = {
    productId,
    name,
    title: 'Updated Nest Mini',
    type: 'PRIMARY',
    categories: ['Updated Speakers and displays'],
    brands: ['Updated Google'],
    priceInfo: {
      price: 20.0,
      originalPrice: 25.5,
      currency_code: "EUR"
    },
    availability: 'OUT_OF_STOCK'
  }

  // Indicates which fields in the provided product to update
  const updateMask = {}

  // Instantiates a client.
  const retailClient = new ProductServiceClient();

  const callUpdateProduct = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        // Construct request
        const request = {
          product
        };

        // Run request
        const response = await retailClient.updateProduct(request);
        console.log('Updated product:', response);

        resolve(response[0]);
      } catch (err) {
        reject(err);
      }
    })
  }

  // Update product
  const updatedProduct = await callUpdateProduct();

  // Delete product
  await utils.deleteProduct(updatedProduct?.name);
  // [END retail_update_product]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
