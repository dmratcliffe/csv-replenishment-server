export class Listing {
    api = {};
    
    constructor(api) {
        this.api = api;
    }

    list(name, cb){
        this.api.get(`/listing/${name}`)
        .then(res=>{
            cb(res.data);
        })
        .catch(err=>console.log("APICalls: Listing: Error:", err))
    }
    
    add(name, item, cb){
        this.api.post(`/addto/${name}`, {item})
        .then(res=>{
            cb(res.data);
        })
        .catch(err=>console.log("APICalls: Add: Error:", err))
    }

    remove(name, item, cb){
        this.api.post(`/removefrom/${name}`, {item})
        .then(res=>{
            cb(res.data);
        })
        .catch(err=>console.log("APICalls: Remove: Error:", err))
    }

    sizes(name, code, cb){
        this.api.post(`/getsizes/${name}`, {code})
        .then(res=>{
            cb(res.data);
        })
        .catch(err=>console.log("APICalls: Sizes: Error:", err))
    }
}