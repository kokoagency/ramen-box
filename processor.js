'use strict'

const _ = require('lodash')
const CoreFilter = require('./filter')
const UnprocessableEntityException = require('./exceptions/UnprocessableEntityException')
const NotFoundException = require('./exceptions/NotFoundException')
const BadRequestException = require('./exceptions/BadRequestException')
const NoPayloadException = require('./exceptions/NoPayloadException')

class CoreProcessor {
	async findBySlug (model, item, id = null) {
		let result = await model.query().where(item.name, item.value).first()
		if (!result) {
			if (id && Number.isInteger(id)) {
				result = await model.find(id)
			}
			throw new NotFoundException('page not found')
		}
		return result
	}

	/**
     *
     * @param {object} model
     * @param {string} item
     */
	async getItem (model, item) {
		try {
			return model.slug ? await this.findBySlug(model, {
				name: model.slug,
				value: item
			}, item) : await model.find(item)
		} catch (e) {
			throw new NotFoundException('page not found')
		}
	}

	async getCollection (model, request) {
		if (!model.query().filter && model.properties && Array.isArray(model.properties) && model.relations && Array.isArray(model.relations)) {
			model.addTrait('@provider:Filterable', CoreFilter(_.difference(model.properties, model.hidden), model.relations))
		}
		if (!model.query().filter && model.properties && Array.isArray(model.properties)) {
			model.addTrait('@provider:Filterable', CoreFilter(_.difference(model.properties, model.hidden), []))
		}
		if (!model.query().filter) {
			model.addTrait('@provider:Filterable', CoreFilter([], []))
		}
		const limit = request.input('limit', 20)
		const page = request.input('page', 1)
		return await model.query().filter(request.get()).paginate(page, limit)
	}

	async postItem (model, request) {
		let raw = null
		try {
			raw = JSON.parse(request.raw())
		} catch (e) {
			raw = request.raw()
		}
		let body = Object.assign({}, raw, request.post())
		if (model.properties) {
			const temp = {}
			model.properties.forEach(e => {
				if (body[e]) {
					temp[e] = body[e]
				}
			})
			body = temp
		}
		let result = null
		// return body
		try {
			result = await model.create(body)
		} catch (e) {
			throw new UnprocessableEntityException({
				message: e.message,
				stack: e.stack
			})
		}

		return result
	}

	async postCollection (model, request) {
		let raw = null
		try {
			raw = JSON.parase(request.raw())
		} catch (e) {
			raw = request.raw()
		}
		const body = raw.map(item => {
			let temp = item
			if (model.properties) {
				temp = {}
				model.properties.forEach(e => {
					if (item[e]) {
						temp[e] = item[e]
					}
				})
				return temp
			}
			return item
		})
		const result = []
		const payload = {
			success: [],
			failed: []
		}
		try {
			body.forEach(async item => {
				result.push(await model.create(item))
				payload.success.push(item)
			})
		} catch (e) {
			payload.failed = _.difference(body, payload.success)
			throw new UnprocessableEntityException({
				message: e.message,
				stack: e.stack,
				payload
			})
		}
		return result
	}

	async putItem (model, request) {
		const item = model.slug ? await this.findBySlug(model, {
			name: model.slug,
			value: request.params.id
		}, request.params.id) : await model.find(request.params.id)
		let raw = null
		try {
			raw = JSON.parase(request.raw())
		} catch (e) {
			raw = request.raw()
		}
		const body = Object.assign({}, raw, request.post())
		let temp = body
		if (model.properties) {
			temp = {}
			model.properties.forEach(e => {
				if (body[e]) {
					temp[e] = body[e]
				}
			})
		}
		Object.keys(temp).forEach(e => {
			if (temp[e]) {
				item[e] = temp[e]
			}
		})
		let flag = false
		try {
			flag = await item.save()
		} catch (e) {
			throw new UnprocessableEntityException({
				message: e.message,
				stack: e.stack
			})
		}
		if (flag) {
			return item
		}
		throw new BadRequestException('no value changed')
	}

	async deleteItem (model, request) {
		const item = model.slug ? await this.findBySlug(model, {
			name: model.slug,
			value: request.params.id
		}, request.params.id) : await model.find(request.params.id)
		item.delete()
		throw new NoPayloadException()
	}
}

module.exports = CoreProcessor
