'use strict'

const CoreTransformer = require('./transformer')
const NotFoundException = require('./exceptions/NotFoundException')

class CoreResponse {
	async wrapCoreItem (request, response, model, data, transform) {
		// setup transformer process
		const transformer = model.transformer ? model.transformer : CoreTransformer(model)
		const relation = request.get().with || ''
		// console.log(transformer)
		const result = await transform.include(relation).item(data, transformer)
		// send it as a JSON response
		return response.status(this.successCode()).json(this.success(result))
	}

	async wrapCoreCollection (request, response, model, data, transform) {
		const transformer = model.transformer ? model.transformer : CoreTransformer(model)
		const relation = request.get().with || ''
		const result = await transform.include(relation).paginate(data, transformer)
		if (result.data.length === 0) {
			throw new NotFoundException('page not found')
		}
		return response.status(this.successCode()).json(this.success(result, request))
	}

	successCode () {
		return 200
	}

	wrapCollection (collection = []) {
		return {
			data: collection,
			meta: {
				status_code: this.successCode(),
				message: 'collection retrieval success'
			}
		}
	}

	wrapItem (item = {}) {
		return {
			data: item,
			meta: {
				status_code: this.successCode(),
				message: 'item retrieval success'
			}
		}
	}

	wrapPagination (pagination = {}, request = null) {
		let previousLink = ''
		let nextLink = ''
		if (request.originalUrl().includes('page')) {
			previousLink = parseInt(pagination.pagination.page) === 1 ? null : request.originalUrl().replace(/page=\d+/, `page=${parseInt(pagination.pagination.page) - 1}`)
			nextLink = parseInt(pagination.pagination.page) === parseInt(pagination.pagination.lastPage) ? null : request.originalUrl().replace(/page=\d+/, `page=${parseInt(pagination.pagination.page) + 1}`)
		} else if (request.originalUrl().includes('?')) {
			previousLink = parseInt(pagination.pagination.page) === 1 ? null : `${request.originalUrl()}&page=${parseInt(pagination.pagination.page) - 1}`
			nextLink = parseInt(pagination.pagination.page) === parseInt(pagination.pagination.lastPage) ? null : `${request.originalUrl()}&page=${parseInt(pagination.pagination.page) + 1}`
		} else {
			previousLink = parseInt(pagination.pagination.page) === 1 ? null : `${request.originalUrl()}?page=${parseInt(pagination.pagination.page) - 1}`
			nextLink = parseInt(pagination.pagination.page) === parseInt(pagination.pagination.lastPage) ? null : `${request.originalUrl()}?page=${parseInt(pagination.pagination.page) + 1}`
		}
		return {
			data: pagination.data,
			meta: {
				status_code: this.successCode(),
				message: 'collection retrieval success',
				pagination: Object.assign({
					next: nextLink,
					previous: previousLink
				}, pagination.pagination)
			}
		}
	}

	success (item, request = null) {
		const result = typeof item.toJSON === 'function' ? item.toJSON() : item
		if (Array.isArray(result)) {
			return this.wrapCollection(result)
		} if (result.pagination) {
			return this.wrapPagination(result, request)
		}
		return this.wrapItem(result)
	}
}

module.exports = CoreResponse
