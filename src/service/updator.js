exports = module.exports = {}

exports.update = async function(id, product) {
	if (!product) return Promise.reject(new Error('product missing'))

	return Promise.resolve('updated')
}