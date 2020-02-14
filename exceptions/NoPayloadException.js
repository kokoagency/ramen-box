'use strict'

const CoreException = require('./CoreException')

class NoPayloadException extends CoreException {
	/**
     * Handle this exception by itself
     */
	handle (error, { response }) {
		this.wrapper(response, 204, error.message)
	}
}

module.exports = NoPayloadException
