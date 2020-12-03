const { fail } = require('assert')
const assert = require('assert')

const service = require('../../src/service')

describe('Service test', function () {
	describe('#isExistingProduct', function () {

		it('should return false when the id > 100', async function () {
			const isP = await service.isExistingProduct(200)
			assert(!isP, 'Product should not exist')
		})

		it('should return true when the id < 100', async function () {
			const isP = await service.isExistingProduct(10)
			assert(isP, 'Product should not exist')
		})

		it('should throw when no id', async function () {
			try {
				await service.isExistingProduct()
				fail('should not get here')
			} catch (err) {
				assert.strictEqual(err.message, 'Id missing', 'Product should not exist')
			}
		})
	})


	describe('#createOrUpdate', function () {
		const product = {
			name: 'myProduct'
		}

		it('should create when the id > 100', async function () {
			const res = await service.createOrUpdate(200, product)
			assert.strictEqual(res, 'created', 'Product should be created')
		})

		it('should update when the id < 100', async function () {
			const res = await service.createOrUpdate(10, product)
			assert.strictEqual(res, 'updated', 'Product should be updated')
		})

		it('should throw when no id for createOrUpdate', async function () {
			try {
				await service.createOrUpdate(null, product)
				fail('should not get here')
			} catch (err) {
				assert.strictEqual(err.message, 'Id missing', 'Product should not exist')
			}
		})
	})

})