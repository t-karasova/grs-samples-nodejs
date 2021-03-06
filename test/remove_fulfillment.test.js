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
const {ProductServiceClient} = require('@google-cloud/retail');
const {assert, expect} = require('chai');

const execSync = cmd => cp.execSync(cmd, {encoding: 'utf-8'});

const cwd = path.join(__dirname, '..');

describe('Remove fulfillment', () => {
  const apiEndpoint = 'retail.googleapis.com';
  const retailClient = new ProductServiceClient({apiEndpoint});
  const productId = Math.random().toString(36).slice(2).toUpperCase();
  const projectNumber = process.env['PROJECT_NUMBER'];
  const name = `projects/${projectNumber}/locations/global/catalogs/default_catalog/branches/default_branch/products/${productId}`;

  let stdout;

  before(async () => {
    stdout = execSync(
      `node product/remove_fulfillment_places.js ${productId}`,
      {cwd}
    );
  });

  it('should check that product created', () => {
    const regex = new RegExp(`Product ${productId} created`, 'g');
    assert.match(stdout, regex);
  });

  it('should check that remove fulfillment started', () => {
    assert.match(stdout, /Start remove fulfillment/);
  });

  it('should check that add fulfillment finished', () => {
    assert.match(stdout, /Remove fulfillment finished/);
  });

  it('should check that product updated correctly', async () => {
    const regex = new RegExp('Updated product: .*\\n', 'g');
    assert.match(stdout, regex);
    const string = stdout
      .match(regex)
      .toString()
      .replace('Updated product: ', '');
    const updatedProduct = JSON.parse(string);

    expect(updatedProduct).to.be.an('object');
    expect(updatedProduct.fulfillmentInfo).to.be.an('array');
    expect(
      updatedProduct.fulfillmentInfo.length,
      'Fulfillment array is empty'
    ).to.equal(1);

    const item = updatedProduct.fulfillmentInfo[0];
    expect(item).to.be.an('object');
    expect(item).to.have.all.keys('type', 'placeIds');
    expect(item.type).to.equal('same-day-delivery');
    expect(item.placeIds)
      .to.be.an('array')
      .that.includes('store3')
      .but.not.include('store2', 'store1');
  });

  it('should check that product deleted', async () => {
    const regex = new RegExp(`Product ${productId} deleted`, 'g');
    assert.match(stdout, regex);
  });

  after(async () => {
    try {
      const product = await retailClient.getProduct({name: name});
      expect(product, 'The product not deleted').to.be.undefined;
    } catch (err) {
      expect(err, 'Bad error code').to.include({code: 5});
    }
  });
});
