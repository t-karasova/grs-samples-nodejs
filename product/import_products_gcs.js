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
  // [START retail_import_products_from_gcs]

  // Imports the Google Cloud client library.
  const { ProductServiceClient } = require('@google-cloud/retail').v2;

  const projectId = process.env['PROJECT_NUMBER'];

  const gcsBucket = "gs://products_catalog"
  const gcsErrorsBucket = "gs://products_catalog/error"
  const gcsProductsObject = "products_for_search.json"

  //TO CHECK ERROR HANDLING USE THE JSON WITH INVALID PRODUCT
  //const gcsProductsObject = "products_for_import_some_invalid.json";

  // Placement
  const parent = `projects/${projectId}/locations/global/catalogs/default_catalog/branches/default_branch`

  // The desired input location of the data.
  const inputConfig = {
    gcsSource: {
      inputUris: [gcsBucket + '/' + gcsProductsObject],
      dataSchema: 'product'
    }
  }

  // The desired location of errors incurred during the Import.
  const errorsConfig = {
    gcsPrefix: gcsErrorsBucket
  }

  // Instantiates a client.
  const retailClient = new ProductServiceClient();

  const callImportProducts = async () => {
    // Construct request
    const request = {
      parent,
      inputConfig,
      errorsConfig
    };

    // Run request
    const [operation] = await retailClient.importProducts(request);
    const [response] = await operation.promise();
    console.log(response);
  }

  await callImportProducts();
  // [END retail_import_products_from_gcs]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
