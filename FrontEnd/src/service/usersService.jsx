import axios from "axios"

class UsersService {

    static BASE_URL = "http://localhost:1010"

    static async login(email,password){
        try{
            const response = await axios.post(`${UsersService.BASE_URL}/auth/login`,{email,password})
            return response.data
        }catch(err){
            throw err
        }
    }

    static async register(userData,token){
        try{
            const response = await axios.post(`${UsersService.BASE_URL}/auth/register`,userData,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        }catch(err){
            throw err
        }
    }

    static logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }
    static isAuthenticated(){
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin(){
        const role = localStorage.getItem('role')
        return role === "ADMIN"
    }

    static isUser(){
        const role = localStorage.getItem('role')
        return role === "USER"
    }

    static adminOnly(){
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UsersService