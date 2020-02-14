'use strict'
const CoreFilter = require('./filter')

function CoreRequest({model, request}) {
    if(model.filter){
        return model.query().filter(request, model.filter)
    }
    return model.query().filter(request, CoreFilter)
}

async function CoreValidation({request, rules = null, model = null}){
    if(!rules){
        rules = model.getRules()
    }

    const validation = await Validate(request.all(), rules)

    return validation
}

module.exports = {CoreRequest}