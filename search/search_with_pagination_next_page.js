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
  // [START retail_search_for_products_with_page_size_and_next_page]

  // Imports the Google Cloud client library.
  const { SearchServiceClient } = require('@google-cloud/retail');

  const projectId = process.env['PROJECT_NUMBER'];
  
  // Placement is used to identify the Serving Config name.
  const placement = `projects/${projectId}/locations/global/catalogs/default_catalog/placements/default_search`;

  // Raw search query.
  const query = 'Hoodie';

  // A unique identifier for tracking visitors.
  const visitorId = '12345';

  // Maximum number of Products to return.
  const pageSize = 1;

  //A page token recieved from a previous search call.
  let pageToken = ''; // set next page token here
  
  // Instantiates a client.
  const retailClient = new SearchServiceClient();


  const callSearch = async () => {
    // Construct request
    const request = {
      placement,
      query,
      visitorId,
      pageSize,
      pageToken
    };

    // Run request
    const response = await retailClient.search(request, {
      autoPaginate: false
    });
    console.log(response);
    console.log('Next page token:', getNextPageToken(response));
  }

  // Get next page token from the response
  const getNextPageToken = (response) => {
    const IResponseParams = {
      ISearchResult: 0,
      ISearchRequest: 1,
      ISearchResponse: 2
    }
    return response[IResponseParams.ISearchResponse]?.nextPageToken;
  }

  callSearch();
  // [END retail_search_for_products_with_page_size_and_next_page]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
