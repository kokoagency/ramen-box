'use strict'

const CoreException = require('./CoreException')

class UnprocessableEntityException extends CoreException {
    /**
     * Handle this exception by itself
     */
    handle (error, {response}) {
        // console.log(error.message)
        this.wrapper(response, 422, error.message.message, error.message.stack)
    }
}

module.exports = UnprocessableEntityException
