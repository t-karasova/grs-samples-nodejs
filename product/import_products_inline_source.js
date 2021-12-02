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
  // [START retail_import_products_from_inline_source]

  // Imports the Google Cloud client library.
  const { ProductServiceClient } = require('@google-cloud/retail').v2;

  const projectNumber = process.env['PROJECT_NUMBER'];

  // Placement
  const parent = `projects/${projectNumber}/locations/global/catalogs/default_catalog/branches/default_branch`

  const product1 = {
    id: Math.random().toString(36).slice(2).toUpperCase(),
    title: '#IamRemarkable Pen',  //TO CHECK ERROR HANDLING COMMENT OUT THE PRODUCT TITLE HERE
    uri: 'https://shop.googlemerchandisestore.com/Google+Redesign/Office/IamRemarkable+Pen',
    brands: ['#IamRemarkable'],
    categories: ["Apparel"],
    priceInfo: {
      price: 16.0,
      originalPrice: 45.0,
      cost: 12.0,
      currencyCode: 'USD'
    },
    colorInfo: {
      colorFamilies: ['Blue'],
      colors: ['Light blue', 'Blue', 'Dark blue'],
    },
    fulFillmentInfo: {
      type: 'pickup-in-store',
      placeIds: ['store1', 'store2']
    },
    retrievable_fields: {
      paths: ['title', 'categories', 'price_info', 'color_info']
    }
  }

  const product2 = {
    id: Math.random().toString(36).slice(2).toUpperCase(),
    title: "Android Embroidered Crewneck Sweater",
    uri: 'https://shop.googlemerchandisestore.com/Google+Redesign/Apparel/Android+Embroidered+Crewneck+Sweater',
    brands: ['Android'],
    categories: ['Apparel'],
    priceInfo: {
      price: 35.0,
      originalPrice: 45.0,
      cost: 12.0,
      currencyCode: 'USD'
    },
    colorInfo: {
      colorFamilies: ['Blue'],
      colors: ['Sky blue'],
    },
    fulFillmentInfo: {
      type: 'pickup-in-store',
      placeIds: ['store2', 'store3']
    },
    retrievable_fields: {
      paths: ['title', 'categories', 'price_info', 'color_info']
    }
  }

  // The desired input location of the data.
  const inputConfig = {
    productInlineSource: {
      products: [product1, product2]
    }
  }

  // Instantiates a client.
  const retailClient = new ProductServiceClient();

  const callImportProducts = async () => {
    // Construct request
    const request = {
      parent,
      inputConfig
    };
    console.log('Import products request:', request);

    // Run request
    const [operation] = await retailClient.importProducts(request);
    const [response] = await operation.promise();
    console.log('Import products response:', response);
  }

  await callImportProducts();
  // [END retail_import_products_from_inline_source]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
