
const status = {
  success: 200,
  error: 500,
  server_error:503,
  notfound: 404,
  unauthorized: 401,
  conflict: 409,
  created: 201,
  created_partial: 202,
  bad: 400,
  nocontent: 204,
};

function sendResponse(res, message, error, status,{data=[],logError=false}={}) {
    if(logError)
    {console.log(error);}
	res.status(status!==undefined?status:(error !== undefined && error!='' && error!=null ? 400 : 200)).json({
		status: error !== undefined && error!='' && error!=null? "error" : "success",        
        data:data,
        message:message!==undefined?message:"Something went wrong"
	});

    return res
}

function sendValidateResponse({result,input}, message="", error="", status=null) {
    const validateResponse={}
        validateResponse.result=result;
		validateResponse.error= error;  
        validateResponse.status=status;
        validateResponse.message=message;
        validateResponse.parsedInput=input;

        return validateResponse;
}

module.exports={
    status,
    sendResponse,
    sendValidateResponse
}