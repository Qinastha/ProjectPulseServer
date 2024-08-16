declare namespace Express {
    export interface Request {
        user: any;
        projects: any[];
    }
    export interface Response {
        user: any;
        projects: any[]
        success: (value,message,statusCode,showUser?) => void,
        error: (error,statusCode,showUser?) => void
    }
}