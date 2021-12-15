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
  // [START retail_search_for_products_with_ordering]
  // Call Retail API to search for a products in a catalog, order the results by different product fields.

  // Imports the Google Cloud client library.
  const { SearchServiceClient } = require('@google-cloud/retail');

  const projectNumber = process.env['PROJECT_NUMBER'];
  
  // Placement is used to identify the Serving Config name.
  const placement = `projects/${projectNumber}/locations/global/catalogs/default_catalog/placements/default_search`;

  // Raw search query.
  const query = 'Hoodie';

  // A unique identifier for tracking visitors.
  const visitorId = '12345';

  // The order in which products are returned.
  const orderBy = 'price desc'; // TRY DIFFERENT ORDER

  // Maximum number of Products to return.
  const pageSize = 10;
  
  // Instantiates a client
  const retailClient = new SearchServiceClient();

  const IResponseParams = {
    ISearchResult: 0,
    ISearchRequest: 1,
    ISearchResponse: 2
  }

  const callSearch = async () => {
    console.log('Search start');
    // Construct request
    const request = {
      placement,
      query,
      visitorId,
      orderBy,
      pageSize
    };

    console.log('Search request: ', request);

    // Run request
    const response = await retailClient.search(request, {autoPaginate: false});
    const searchResult = response[IResponseParams.ISearchResponse];
    console.log('Search result: ', JSON.stringify(searchResult, null, 4));
    console.log('Search end');
  }

  callSearch();
  // [END retail_search_for_products_with_ordering]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
