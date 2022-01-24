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
const {assert, expect} = require('chai');
const {Storage} = require('@google-cloud/storage');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

const cwd = path.join(__dirname, '..');

describe('Create gcs bucket for events', () => {
  const projectId = process.env['PROJECT_ID'];
  const bucketName = `${projectId}_events_${Math.round(Date.now() / 1000)}`;
  const fileName1 = 'user_events.json';
  const fileName2 = 'user_events_some_invalid.json';
  let isBucketExist = false;
  let stdout;

  before(async () => {
    const storage = new Storage();
    const [buckets] = await storage.getBuckets();
    const bucketNames = buckets.map(item => item.name);
    isBucketExist = bucketNames.indexOf(bucketName) !== -1 ? true : false;

    stdout = execSync(`node setup/events_create_gcs_bucket.js ${bucketName}`, {
      cwd,
    });
  });

  it('should check that gcs bucket created', async () => {
    let regex = '';
    if (isBucketExist) {
      regex = new RegExp(`Bucket ${bucketName} alreaty exists`, 'g');
    } else {
      regex = new RegExp(`Bucket ${bucketName} created`, 'g');
    }
    assert.match(stdout, regex);
  });

  it('should check that files uploaded', async () => {
    const regexFirst = new RegExp(
      `File ${fileName1} uploaded to ${bucketName}`,
      'g'
    );
    const regexSecond = new RegExp(
      `File ${fileName2} uploaded to ${bucketName}`,
      'g'
    );
    assert.match(stdout, regexFirst);
    assert.match(stdout, regexSecond);
  });

  after(async () => {
    if (!isBucketExist) {
      const storage = new Storage();
      await storage.bucket(bucketName).deleteFiles({force: true});
      await storage.bucket(bucketName).delete();

      const [buckets] = await storage.getBuckets();
      const bucketNames = buckets.map(item => item.name);
      const isBucketDeleted =
        bucketNames.indexOf(bucketName) !== -1 ? false : true;

      expect(isBucketDeleted).to.be.true;
    }
  });
});
