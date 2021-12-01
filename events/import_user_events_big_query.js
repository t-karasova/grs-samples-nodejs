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
  // [START retail_import_user_events_big_query]

  // Imports the Google Cloud client library.
  const { UserEventServiceClient } = require('@google-cloud/retail').v2;

  const projectNumber = process.env['PROJECT_NUMBER'];

  const datasetId = 'user_events';
  const tableId = 'import_tutorial';
  const dataSchema = 'user_event';
  // TO CHECK ERROR HANDLING USE THE TABLE OF INVALID USER EVENTS
  // const tableId = 'import_tutorial_invalid'; 

  // Placement
  const parent = `projects/${projectNumber}/locations/global/catalogs/default_catalog`

  // The desired input location of the data.
  const inputConfig = {
    bigQuerySource: {
      projectId,
      datasetId,
      tableId,
      dataSchema
    }
  }

  // Instantiates a client.
  const retailClient = new UserEventServiceClient();

  const callImportUserEvents = async () => {
    // Construct request
    const request = {
      parent,
      inputConfig
    };

    console.log('Import request: ', request);

    // Run request
    const [operation] = await retailClient.importUserEvents(request);
    const [response] = await operation.promise();
    console.log(response);
  }

  await callImportUserEvents();
  // [END retail_import_user_events_big_query]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
