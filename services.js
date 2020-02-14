const _ = require('lodash')
const CoreProcessor = require('./processor')
const NotFoundException = require('./exceptions/NotFoundException')

class CoreServices {
	constructor (model) {
		this.model = model
		this.processor = new CoreProcessor()
	}

	async getItem (request) {
		// params validation
		if (!request.params.id) {
			throw new NotFoundException('slug not found')
		}
		// security process
		const params = _.escape(request.params.id)
		// database process
		const data = await this.processor.getItem(this.model, params)
		// throw 404 if there is no result found
		if (!data) {
			throw new NotFoundException('item not found')
		}
		return data
	}

	async getCollection (request) {
		const data = await this.processor.getCollection(this.model, request)

		return data
	}

	async postItem (request) {
		const data = await this.processor.postItem(this.model, request)
		return data
	}

	async putItem (request) {
		const data = await this.processor.putItem(this.model, request)
		return data
	}

	async deleteItem (request) {
		await this.processor.deleteItem(this.model, request)
	}
}

module.exports = CoreServices
