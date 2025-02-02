export const validationMiddleware = (schema) => {
    return (req, res, next) => {
        const schemaKeys = Object.keys(schema)
        const validationError = []
        console.log(schemaKeys)
        for (const key of schemaKeys) {
            console.log(key)
            const { error } = schema[key].validate(req[key], { abortEarly: false })
            console.log(error)
            if (error) validationError.push(...error.details)
        }
        if (validationError.length) return res.status(400).json({ message: "validation error", error: validationError })
        next()
    }
}