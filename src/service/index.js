const fetcher = require('./fetcher')
const refetcher = require('./refetcher')
const updator = require('./updator')
const creator = require('./creator')

exports = module.exports = {}

exports.isExistingProduct = async function(id) {
	const product = await fetcher.fetchProduct(id)
	return !!product
}

exports.createOrUpdate = async function(id, product) {
	const productDB = await fetcher.fetchProduct(id)
	let operation
	if (productDB) {
		operation = await updator.update(id, product)
	} else {
		operation = await creator.create(id, product)
	}
	return await refetcher.fetchProduct(product, operation)
}