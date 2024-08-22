import axios from "axios"

class UsersService {

    static BASE_URL = "http://localhost:1010"

    static async login(email, password) {
        try {
            const response = await axios.post(`${UsersService.BASE_URL}/auth/login`, { email, password })
            return response.data
        } catch (err) {
            throw err
        }
    }

    static async register(userData, token) {
        try {
            const response = await axios.post(`${UsersService.BASE_URL}/auth/register`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (err) {
            throw err
        }
    }

    static async getYourProfile(token) {
        try {
            const response = await axios.get(`${UsersService.BASE_URL}/adminuser/get-profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data
        } catch (err) {
            throw err
        }
    }

    static async getUserId(token, id) {
        try {
            const response = await axios.get(`${UsersService.BASE_URL}/get-users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async getAllUsers(token) {
        try {
            const response = await axios.get(`${UsersService.BASE_URL}/get-all-users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("response", response.data)
            return response.data
        } catch (err) {
            throw err
        }
    }

    static async updateUser(userId, userData, token) {
        try {
            const response = await axios.put(`${UsersService.BASE_URL}/adminuser/update/${userId}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }


    static async deleteUser(userId, token) {
        try {
            const response = await axios.delete(`${UsersService.BASE_URL}/admin/delete/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async importFileExcel(file, token) {
        try {
            const response = await axios.post(`${UsersService.BASE_URL}/admin/upload`, file, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async exportFileExcel(token) {
        try {
            const response = await axios.get(`${UsersService.BASE_URL}/admin/export`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async lockUser(userId,token){
        try {
            const response = await axios.post(`${UsersService.BASE_URL}/admin/lock/${userId}`, {},{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (err) {
            throw err;
        }
    }

    static async unLockUser(userId,token){
        try{
            const response = await axios.post(`${UsersService.BASE_URL}/admin/unlock/${userId}`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })  
            return response.data
        }catch(err){
            throw err;
        }
    }


    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
    }



    static isAuthenticated() {
        const token = localStorage.getItem('token')
        return !!token
    }

    static isAdmin() {
        const role = localStorage.getItem('role')
        return role === "ADMIN"
    }

    static isUser() {
        const role = localStorage.getItem('role')
        return role === "USER"
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UsersService