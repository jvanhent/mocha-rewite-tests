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

		it('should return false when the id > 100', async function () {
			const product = { name: 'myProduct' }
			wrapFetch(product, async function () {
				const isP = await service.isExistingProduct(200)
				assert(!isP, 'Product should not exist')
			})
		})

		it('should return true when the id < 100', async function () {
			wrapFetch(null, async function () {
				const isP = await service.isExistingProduct(10)
				assert(isP, 'Product should not exist')
			})
		})

		it('should throw when no id', async function () {
			wrapFetchThrow(async function () {
				try {
					await service.isExistingProduct(10)
					fail('should not get here')
				} catch (err) {
					assert.strictEqual(err.message, 'Id missing', 'Product should not exist')
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
				fetcher: { fetchProduct: async  (id) => p },
				creator: { create: async () => 'created' },
				updator: { update: async () => 'updated' },
				refetcher: { fetchProduct: async (prod, operation) => `${prod.name} ${operation}` },
			})(fn)
		}
		it('should create when the id > 100', async function () {
			wrapAll(null, async () => {
				const res = await service.createOrUpdate(200, product)
				assert.strictEqual(res, 'myProduct created', 'Product should be created')
			})
		})

		it('should update when the id < 100', async function () {
			wrapAll(product, async () => {
				const res = await service.createOrUpdate(10, product)
				assert.strictEqual(res, 'updated', 'Product should be updated')
			})
		})
	})

})