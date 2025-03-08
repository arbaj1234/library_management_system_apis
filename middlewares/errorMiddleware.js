
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}


export const errorMiddleware = (err, req, res, next) => {
    // console.log("error from middleware", err);
    err.message = err.message  && err.stack || "Internal Server Error"
    err.statusCode = err.statusCode || 500
    // console.log(err);

    if (err.code === 11000) {
        const statusCode = 400
        const message = 'Duplicate field value entered'
        err = new Error(message, statusCode)
    }

    if (err.name === "JsonWebToken") {
        const statusCode = 400
        const message = 'JWT is invalid. Try again'
        err = new Error(message, statusCode)
    }

    if (err.code === "TokenExpiredError") {
        const statusCode = 400
        const message = 'Token is expired. Try again'
        err = new Error(message, statusCode)
    }

    if (err.code === "CastError") {
        const statusCode = 400
        const message = `Resource not found. Invalid: ${err.path}`
        err = new Error(message, statusCode)
    }

    const errorMessage = err.errors ? Object.values(err.errors).map(err => err.message).join(" ") : err.message

    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    })
}

export default ErrorHandler