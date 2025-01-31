// error handler middleware 3and kol router fe el code
export const errorHandlerMiddleware = (api) => {
    return (req, res, next) => {
        api(req, res, next).catch((error) => {
            console.log(`Error in ${req.url} from error handler middleware`, error)
            return next(new Error(error.message, { cause: 500 }))
        })
    }
}

// el global fun elly 3and a5er router app.use()
export const globalErrorHandler = (err, req, res, next) => {
    console.log(`Global error handler: ${err.message}`);
    return res.status(500).json({ message: "server error something went wrong", err: err.message })
}