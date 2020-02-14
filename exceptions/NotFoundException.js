'use strict'

const CoreException = require('./CoreException')

class NotFoundException extends CoreException {
	/**
     * Handle this exception by itself
     */
	handle (error, { response }) {
		this.wrapper(response, 404, error.message)
	}
}

module.exports = NotFoundException
