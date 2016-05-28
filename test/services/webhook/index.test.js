'use strict'

const assert = require('assert')
const app = require('../../../src/app')

describe('webhook service', function() {
  it('registered the webhooks service', () => {
    assert.ok(app.service('webhooks'))
  })
})
