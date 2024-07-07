declare namespace Express {
    export interface Request {
        user: any;
    }
    export interface Response {
        user: any;
        success: (value,message,statusCode,showUser?) => void,
        error: (error,statusCode,showUser?) => void
    }
}