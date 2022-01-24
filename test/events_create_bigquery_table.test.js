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

const path = require('path');
const cp = require('child_process');
const {before, describe, it, after} = require('mocha');
const {assert} = require('chai');
const {BigQuery} = require('@google-cloud/bigquery');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

const cwd = path.join(__dirname, '..');

describe('Create big query table for events', () => {
  const dataset = 'user_events';
  const validTable = 'events';
  const invalidTable = 'events_some_invalid';
  let isDatasetExist = false;
  let stdout;

  before(async () => {
    const bigquery = new BigQuery();
    const [datasets] = await bigquery.getDatasets();
    const datasetIds = datasets.map(dataset => dataset.id);
    isDatasetExist = datasetIds.indexOf(dataset) !== -1 ? true : false;
    stdout = execSync('node setup/events_create_bigquery_table.js', {cwd});
  });

  it('should check that big query dataset created', async () => {
    let regex = '';
    if (isDatasetExist) {
      regex = new RegExp(`Dataset ${dataset} already exists`, 'g');
    } else {
      regex = new RegExp(`Dataset ${dataset} created`, 'g');
    }
    assert.match(stdout, regex);
  });

  it('should check that big query tables created', async () => {
    let regexValidTable = '';
    let regexInvalidTable = '';
    if (isDatasetExist) {
      regexValidTable = new RegExp(`Table ${validTable} already exists`, 'g');
      regexInvalidTable = new RegExp(
        `Table ${invalidTable} already exists`,
        'g'
      );
    } else {
      regexValidTable = new RegExp(`Table ${validTable} created.`, 'g');
      regexInvalidTable = new RegExp(`Table ${invalidTable} created.`, 'g');
    }
    assert.match(stdout, regexValidTable);
    assert.match(stdout, regexInvalidTable);
  });

  it('should check that source files uploaded', async () => {
    const regex = new RegExp('Job \\S* completed', 'g');
    assert.match(stdout, regex);
  });

  after(async () => {
    if (!isDatasetExist) {
      const bigquery = new BigQuery();
      await bigquery.dataset(dataset).delete({force: true});
    }
  });
});
