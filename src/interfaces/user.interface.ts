export interface LoggedUser {
    nickname: string,
    email: string,
    rol: string,
    loginTime: Date
}

export interface User {
    nombre_usuario: string,
    email_usuario: string,
    rol: string,
    is_active: boolean
}