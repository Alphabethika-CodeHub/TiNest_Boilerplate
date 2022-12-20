export interface ReturnInterface { statusCode: any, message: string, data: object | string }

export enum RoleList {
    User = 'USER',
    Admin = 'ADMIN',
}

export interface ControllerResponse {
    statusCode: any;
    message: string;
    data: string | object;
}