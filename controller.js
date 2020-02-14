'use strict'

// const CoreProcessor = require('./processor')
const CoreResponse = require('./response')
// const CoreTransformer = require('./transformer')
const CoreServices = require('./services')
// const NotFoundException = require('./exceptions/NotFoundException')
// const UnprocessableEntityException = require('./exceptions/UnprocessableEntityException')
class CoreController {
	constructor (model, services = null) {
		this.model = model
		// this.processor = new CoreProcessor()
		this.response = new CoreResponse()
		this.services = services || new CoreServices(this.model)
	}

	/**
     * get Item based on parameter
     * @param {object} ctx Context Information
     */
	async getItem ({ request, response, transform }) {
		const data = await this.services.getItem(request)
		return this.response.wrapCoreItem(request, response, this.model, data, transform)
	}

	// // get group
	async getCollection ({ request, response, transform }) {
		// params validation
		// console.log('data')
		const data = await this.services.getCollection(request)
		// console.log('data',data)
		return this.response.wrapCoreCollection(request, response, this.model, data, transform)
	}

	// // post
	async postItem ({ request, response, transform }) {
		const data = await this.services.postItem(request)
		return this.response.wrapCoreItem(request, response, this.model, data, transform)
	}

	// // post group
	// async postCollection({request, response}){
	async putItem ({ request, response, transform }) {
		const data = await this.services.putItem(request)
		return this.response.wrapCoreItem(request, response, this.model, data, transform)
	}

	async deleteItem ({ request }) {
		await this.services.deleteItem(request)
		// return this.response.wrapCoreItem(request, response, this.model, data, transform)
	}
	// }
	// // put
	// // put group
	// // delete
	// // delete group
}

module.exports = CoreController
