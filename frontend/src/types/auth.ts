export interface User{
    id:string;
    name:string;
    email:string;
    role:string;
}

export interface LoginData{
    email:string;
    password:string;
}

export interface RegisterData{
    name:string;
    email:string;
    password:string;
    role:string;
    
}