class HandleError{
    constructor(
        statuscode,
        message = "something went wrong"
    ){
        this.statuscode = statuscode
        this.message = message
        this.data = null
        this.success = false
    }
}



export default HandleError