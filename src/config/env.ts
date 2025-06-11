const getValue = (key: string) : string => {
    var value = process.env[key];
    if(!value) {
        console.error(`Value for environment variable ${key} is not defined!`)
        process.exit(0);
    }
    return value;
}

export const PORT = getValue('PORT');
export const MONGO_DB_URI = getValue('MONGO_DB_URI');
export const DB_NAME = getValue('DB_NAME');
export const JWT_SECRET = getValue('JWT_SECRET');
