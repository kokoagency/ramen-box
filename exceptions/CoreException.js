'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class CoreException extends LogicalException {
    wrapper(response, status, message, stack = null){
        const result = {
            data: null,
            meta: {
                message: message,
                status_code: status
            }
        }
        // console.log(message)
        if(stack){
            result.meta.stack = stack
        }
        // console.log(result)
        response.status(status).json(result)
    }
}

module.exports = CoreException
