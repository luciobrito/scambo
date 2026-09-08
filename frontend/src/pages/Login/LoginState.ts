export interface LoginState {
    email : string,
    senha : string
}
export const defaultLoginState : LoginState = {email : "", senha: ""}