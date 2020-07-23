type ErrorCodeType = {
    [key:number]: string
}

export class AppErrorCode {
    private static readonly __appErrorCodes: ErrorCodeType = {}

    // 客户端
    static readonly OK = 0

    static readonly ERROR_UNKNOWN = 1000
    static readonly USER_ALREADY_EXISTS = 1100

    // 服务端内部
    static readonly ERROR_INTERNAL_UNKNOWN = 2000

    static readonly CONFIG_NOT_FOUND = 2100
    static readonly CONFIG_BAD = 2101

    static readonly NOT_READY = 2200

    static readonly DUMPLICATED = 2300

    static readonly RESOURCE_NOT_FOUND = 2400

    static readonly DATABASE_ERROR = 2500

    constructor() {
        AppErrorCode.__appErrorCodes[AppErrorCode.OK] = 'OK：成功处理了客户端的请求。'
        AppErrorCode.__appErrorCodes[AppErrorCode.ERROR_UNKNOWN] = 'ERROR_UNKNOWN：未知错误。'


        AppErrorCode.__appErrorCodes[AppErrorCode.ERROR_INTERNAL_UNKNOWN] = 'ERROR_INTERNAL_UNKNOWN：未知的错误。'

        AppErrorCode.__appErrorCodes[AppErrorCode.CONFIG_NOT_FOUND] = 'CONFIG_NOT_FOUND：应用的某些功能需要配置某些环境变量，但是没有找到相应的配置。'
        AppErrorCode.__appErrorCodes[AppErrorCode.CONFIG_BAD] = 'CONFIG_BAD：应用的某些功能需要正确配置某些环境变量，但是发现了不正确的配置。'

        AppErrorCode.__appErrorCodes[AppErrorCode.NOT_READY] = 'NOT_READY：应用的某些功能依赖之前的某些功能，但是这些功能没有准备好。'

        AppErrorCode.__appErrorCodes[AppErrorCode.DUMPLICATED] = 'DUMPLICATED：已经启用了某种功能，但是又收到再次启用的申请，例如一个用户重复登录。'

        AppErrorCode.__appErrorCodes[AppErrorCode.RESOURCE_NOT_FOUND] = 'RESOURCE_NOT_FOUND：用户请求的资源不存在'

        AppErrorCode.__appErrorCodes[AppErrorCode.DATABASE_ERROR] = 'DATABASE_ERROR：服务器处理数据库时，数据库报错'


    }

    static getText (code: number) {
        return AppErrorCode.__appErrorCodes[code] || `没有找到与 ${code} 对应的错误代码说明信息`
    }
}

export class AppError extends Error {
    constructor(public code: number, msg?: string) {
        super(msg)
    }
}
