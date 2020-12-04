const { fail } = require('assert')
const assert = require('assert')
const rewire = require('rewire')

const service = rewire('../../src/service')

describe('Service Rewire test', function () {
	describe('#isExistingProduct', function () {
		const wrapFetch = function (p, fn) {
			service.__with__({
				fetcher: {
					fetchProduct: async function (id) {
						return p
					}
				}
			})(fn)
		}
		const wrapFetchThrow = function (fn) {
			service.__with__({
				fetcher: {
					fetchProduct: async function (id) {
						throw new Error('fetch failed')
					}
				}
			})(fn)
		}

		it('should return true when product found', function (done) {
			const product = { name: 'myProduct' }
			wrapFetch(product, async function () {
				try {
					const isP = await service.isExistingProduct(200)
					done(assert(isP, 'Product should not exist'))
				} catch (err) {
					done(assert.strictEqual(err.message, 'fetch failed', 'Should have thrown'))
				}
			})
		})

		it('should return false when product not found', function (done) {
			wrapFetch(null, async function () {
				try {
					const isP = await service.isExistingProduct(10)
					done(assert(!isP, 'Product should not exist'))
				} catch (err) {
					done(assert.strictEqual(err.message, 'fetch failed', 'Should have thrown'))
				}
			})
		})

		it('should throw when no id', function (done) {
			wrapFetchThrow(async function () {
				try {
					await service.isExistingProduct(10)
					fail('should not get here')
				} catch (err) {
					done(assert.strictEqual(err.message, 'fetch failed', 'Should have thrown'))
				}
			})
		})
	})


	describe('#createOrUpdate', function () {
		const product = {
			name: 'myProduct'
		}

		const wrapAll = function (p, fn) {
			service.__with__({
				fetcher: { fetchProduct: async (id) => p },
				creator: { create: async () => 'created' },
				updator: { update: async () => 'updated' },
				refetcher: { fetchProduct: async (prod, operation) => `${prod.name} ${operation}` },
			})(fn)
		}
		it('should create when the id > 100', function (done) {
			wrapAll(null, async () => {
				try {
					const res = await service.createOrUpdate(200, product)
					assert.strictEqual(res, 'myProduct created', 'Product should be created')
					done()
				} catch (err) {
					done(err)
				}
			})
		})

		it('should update when the id < 100', function (done) {
			wrapAll(product, async () => {
				try {
					const res = await service.createOrUpdate(10, product)
					assert.strictEqual(res, 'myProduct updated', 'Product should be updated')
					done()
				} catch (err) {
					done(err)
				}
			})
		})
	})

})