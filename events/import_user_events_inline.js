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
  // [START retail_import_user_events_inline]

  // Imports the Google Cloud client library.
  const { UserEventServiceClient } = require('@google-cloud/retail').v2;

  const projectNumber = process.env['PROJECT_NUMBER'];

  // Placement
  const parent = `projects/${projectNumber}/locations/global/catalogs/default_catalog`

  // Create events
  const generateEvent = (eventType) => {
    return {
      eventType,
      visitorId: 'visitor_' + Math.random().toString(36).slice(2),
      eventTime: {
        seconds: Math.round(Date.now() / 1000)
      }
    }
  }

  // The desired input location of the data.
  const inputConfig = {
    userEventInlineSource: {
      userEvents: [
        generateEvent('home-page-view'),
        generateEvent('home-page-view'),
        generateEvent('home-page-view')
      ]
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
  // [END retail_import_user_events_inline]
}

process.on('unhandledRejection', err => {
  console.error(err.message);
  process.exitCode = 1;
});

main();
