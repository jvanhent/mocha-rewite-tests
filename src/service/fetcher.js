exports = module.exports = {}

exports.fetchProduct = async function(id) {
	if (!id) return Promise.reject(new Error('Id missing'))

	if (id > 100) {
		return Promise.resolve(null)
	}
	return Promise.resolve({
		id,
		name: `Product: ${id}`
	})
}