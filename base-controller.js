class BaseController{
    async beforeFilterGetItem(params){
        return await params
    }

    async afterFilterGetItem(params){
        return await params
    }

    async beforeProcessGetItem(params){
        return await params
    }

    async afterProcessGetItem(params, data){
        return await {params, data}
    }

    async beforeTransformGetItem(data){
        return await data
    }

    async afterTransformGetItem(data){
        return await data
    }
    
    async beforeResponseGetItem(data){
        return await data
    }
}

module.exports = BaseController