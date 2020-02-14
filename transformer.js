'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const { ioc } = require('@adonisjs/fold')
const _ = require('lodash')

const CoreGenerator = m => {
	_.mixin(require('lodash-inflection'))
	class CoreTransformer extends BumblebeeTransformer {
		static get defaultInclude () {
			return m.sa ? m.defaultInclude : []
		}

		static get availableInclude () {
			return m.relations ? m.relations : []
		}

		transform (model) {
			const result = {}
			if (m.properties) {
				_.difference(m.properties, m.hidden).forEach(element => {
					result[element] = model[element]
				})
			}
			return result
		}
	}
	if (m.relations) {
		m.relations.forEach(element => {
			const model = element.charAt(0).toUpperCase() + element.slice(1)
			CoreTransformer.prototype[`include${_.pluralize(model)}`] = function transforming (item) {
				return this.item(item.getRelated(element), ioc.use(`App/Models/${_.singularize(model)}`).transformer ? ioc.use(`App/Models/${_.singularize(model)}`).transformer : CoreGenerator(ioc.use(`App/Models/${_.singularize(model)}`)))
			}
		})
	}
	return CoreTransformer
}

module.exports = CoreGenerator
