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
const {before, describe, it} = require('mocha');
const {assert, expect} = require('chai');
const {Storage} = require('@google-cloud/storage');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

const cwd = path.join(__dirname, '..');

describe('Delete gcs bucket', () => {
  const projectId = process.env['PROJECT_ID'];
  const bucketName = `${projectId}_${Math.round(Date.now() / 1000)}`;
  let stdout;

  before(async () => {
    const storage = new Storage();
    const location = 'us';
    const storageClass = 'STANDARD';
    const createdBucket = await storage.createBucket(bucketName, {
      location,
      [storageClass]: true,
    });

    expect(createdBucket).to.be.an('array');
    expect(createdBucket.length).to.be.at.least(1);
    const bucket = createdBucket[0];
    expect(bucket.name).to.equal(bucketName);

    stdout = execSync(`node setup/delete_gcs_bucket.js ${bucketName}`, {
      cwd,
    });
  });

  it('should check that gcs bucket deleted', async () => {
    const regex = new RegExp(`Bucket ${bucketName} deleted`, 'g');
    assert.match(stdout, regex);
  });
});
