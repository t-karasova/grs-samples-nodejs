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

  const projectNumber = process.env['PROJECT_NUMBER'];

  // The ID to use for the product
  const productId = ''; //SET THE PRODUCT ID

  // The parent catalog resource name
  const name = `projects/${projectNumber}/locations/global/catalogs/default_catalog/branches/default_branch/products/${productId}`;

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
    // Construct request
    const request = {
      product
    };
    console.log('Update product request:', request);

    // Run request
    const response = await retailClient.updateProduct(request);
    console.log('Updated product:', response);
  }

  callUpdateProduct();
  // [END retail_update_product]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
