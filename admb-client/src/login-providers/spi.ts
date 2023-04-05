export interface SessionIds {
    jsessionid:string,
    xcsrf:string
}
export interface LoginProvider {
    login(url:string, account:string, username:string, password:string):Promise<SessionIds>
}
