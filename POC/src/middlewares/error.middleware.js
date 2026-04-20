import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
    let error =  err;
    if(!(error instanceof ApiError)){
        const statusCode = error.statusCode || 500;

        error = new ApiError(
            statusCode,
            error.message || "Internal Server Error",
            error?.errors || [],
            error.stack
        )
    }

    return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
    });
};

export default errorMiddleware;