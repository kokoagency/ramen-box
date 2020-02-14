'use strict'

const CoreException = require('./CoreException')

class NotAllowedException extends CoreException {
	/**
     * Handle this exception by itself
     */
	handle (error, { response }) {
		this.wrapper(response, 405, error.message)
	}
}

module.exports = NotAllowedException
