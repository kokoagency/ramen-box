'use strict'

const CoreException = require('./CoreException')

class BadRequest extends CoreException {
	/**
     * Handle this exception by itself
     */
	handle (error, { response }) {
		this.wrapper(response, 400, error.message)
	}
}

module.exports = BadRequest
