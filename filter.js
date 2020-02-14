const ModelFilter = use('ModelFilter')
const { ioc } = require('@adonisjs/fold')
const _ = require('lodash')

function CoreFilter (properties = [], relations = []) {
	_.mixin(require('lodash-inflection'))
	class CFilter extends ModelFilter {
	}
	properties.forEach(element => {
		CFilter.prototype[element] = function filter (item) {
			if (Number.isInteger(parseInt(item))) {
				return this.where(element, item)
			}
			// more-than
			if (item.charAt(0) === '>') {
				return this.where(element, '>', item.substring(1))
			}
			// more-than equal
			if (item.charAt(0) === '+') {
				return this.where(element, '>=', item.substring(1))
			}
			// less-than
			if (item.charAt(0) === '<') {
				return this.where(element, '<', item.substring(1))
			}
			// less-than equal
			if (item.charAt(0) === '-') {
				return this.where(element, '<=', item.substring(1))
			}
			// like
			if (item.charAt(0) === '%') {
				return this.where(element, 'LIKE', `%${item.substring(1)}%`)
			}
			// all but not
			if (item.charAt(0) === '!') {
				return this.whereNot(element, item.substring(1))
			}
			// between
			if (item.charAt(0) === '|') {
				const value = item.substring(1, item.length).split(',')
				return this.whereBetween(element, value)
			}
			// not between
			if (item.charAt(0) === '_') {
				const value = item.substring(1, item.length).split(',')
				return this.whereNotBetween(element, value)
			}
			// group
			if (item.charAt(0) === '[') {
				const value = item.substring(1, item.length - 1).split(',')
				return this.whereIn(element, value)
			}
			// all but not group
			if (item.charAt(0) === '{') {
				const value = item.substring(1, item.length - 1).split(',')
				return this.whereNotIn(element, value)
			}

			return this.where(element, item)
		}
	})
	relations.forEach(model => {
		const items = ioc.use(`App/Models/${_.singularize(model)}`).properties
		items.forEach(element => {
			CFilter.prototype[element] = function filter (item) {
				if (Number.isInteger(parseInt(item))) {
					return this.related(model, element, item)
				}
				// more-than
				if (item.charAt(0) === '>') {
					return this.related(model, element, '>', item.substring(1))
				}
				// more-than equal
				if (item.charAt(0) === '+') {
					return this.related(model, element, '>=', item.substring(1))
				}
				// less-than
				if (item.charAt(0) === '<') {
					return this.related(model, element, '<', item.substring(1))
				}
				// less-than equal
				if (item.charAt(0) === '-') {
					return this.related(model, element, '<=', item.substring(1))
				}
				// like
				if (item.charAt(0) === '%') {
					return this.related(model, element, 'LIKE', `%${item.substring(1)}%`)
				}
				// all but not
				if (item.charAt(0) === '!') {
					return this.relatedNot(model, element, item.substring(1))
				}
				// between
				if (item.charAt(0) === '|') {
					const value = item.substring(1, item.length).split(',')
					return this.relatedBetween(model, element, value)
				}
				// not between
				if (item.charAt(0) === '_') {
					const value = item.substring(1, item.length).split(',')
					return this.relatedNotBetween(model, element, value)
				}
				// group
				if (item.charAt(0) === '[') {
					const value = item.substring(1, item.length - 1).split(',')
					return this.relatedIn(model, element, value)
				}
				// all but not group
				if (item.charAt(0) === '{') {
					const value = item.substring(1, item.length - 1).split(',')
					return this.relatedNotIn(model, element, value)
				}

				return this.related(model, element, item)
			}
		})
	})
	// console.log(CFilter, CFilter.prototype, CFilter.prototype.id, CFilter.prototype.username)
	return CFilter
}

module.exports = CoreFilter
