module.exports=function errorHandler(statusCode,message)
{
        const error=new Error();//Js constructor for generating the error
        error.statusCode=statusCode;
        error.message=message;
        return error;
} 