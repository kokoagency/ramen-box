'use strict'

const CoreException = require('./CoreException')

class UndefinedException extends CoreException {
    /**
     * Handle this exception by itself
     */
    handle (error, {response}) {
        this.wrapper(response, 500, error.message)
    }
}

module.exports = UndefinedException
