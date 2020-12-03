exports = module.exports = {}

exports.create = async function (id, product) {
	if (!product) return Promise.reject(new Error('product missing'))

	return Promise.resolve('created')
}