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
// Imports the Google Cloud client library.
const { ProductServiceClient } = require('@google-cloud/retail').v2;
const { exec } = require('child_process');

const createProduct = async (projectNumber, generatedProductId, isFullfillment = false) => {
  // The parent catalog resource name
  const parent = `projects/${projectNumber}/locations/global/catalogs/default_catalog/branches/default_branch`;

  // The ID to use for the product
  const productId = generatedProductId ? generatedProductId : Math.random().toString(36).slice(2).toUpperCase();

  const fulfillmentInfo = isFullfillment ? [{
    type: 'same-day-delivery',
    placeIds: ['store1', 'store2', 'store3']
  }] : [];

  // The product to create.
  const product = {
    title: 'Nest Mini',
    type: 'PRIMARY',
    categories: ['Speakers and displays'],
    brands: ['Google'],
    fulfillmentInfo,
    priceInfo: {
      price: 30.0,
      originalPrice: 35.5,
      currency_code: "USD"
    },
    availability: 'IN_STOCK'
  }

  const retailClient = new ProductServiceClient();

  return new Promise(async (resolve, reject) => {
    try {
      // Construct request
      const request = {
        parent,
        product,
        productId
      };

      // Run request
      const response = await retailClient.createProduct(request);
      console.log(`Product ${response[0].id} created`);
      resolve(response[0]);

    } catch (err) {
      reject(err);
    }
  })
}

const getProduct = (name) => {
  const retailClient = new ProductServiceClient();

  return new Promise(async (resolve, reject) => {
    try {
      // Construct request
      const request = {
        name
      };

      // Run request
      const response = await retailClient.getProduct(request);
      resolve(response);

    } catch (err) {
      reject(err);
    }
  })
}


const deleteProduct = (name) => {
  const retailClient = new ProductServiceClient();

  return new Promise(async (resolve, reject) => {
    try {
      // Construct request
      const request = {
        name
      };

      // Run request
      const response = await retailClient.deleteProduct(request);
      resolve(response);

    } catch (err) {
      reject(err);
    }
  })
}


const getProjectId = () => {
  return new Promise((resolve, reject) => {
    const command = 'gcloud config get-value project --format json'
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else if (stdout) {
        resolve(JSON.parse(stdout));
      } else if (stderr) {
        reject(stderr);
      }      
    })
  })

}

module.exports = {createProduct, getProduct, deleteProduct, getProjectId}