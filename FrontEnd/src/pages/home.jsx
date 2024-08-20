import { useEffect, useState } from "react"
import NavBar from "../components/navbar"
import UsersService from "../service/usersService"

const Home = () =>{

    const [isLoading,setIsLoading] = useState(true)
    const [allUsers,setAllUsers] = useState([])

    const fetchAllUser = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await UsersService.getAllUsers(token)
            setAllUsers(response.ourUsersList)
            console.log("Our users list:", response.ourUsersList);
        } catch (error) {
            console.log("error fetch user", error)
        }
    }

    useEffect(() => {
        fetchAllUser()
        setIsLoading(false)
    }, [])

    return (
        <>
            <div className="h-screen w-full overflow-hidden">
                <NavBar />
                <div className="px-5 md:px-10 py-6">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[500px] overflow-y-auto">
                        {isLoading ? (
                            <div className="text-center py-6">Loading...</div>
                        ) : allUsers?.length > 0 ? (
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">ID</th>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Email</th>
                                        <th scope="col" className="px-6 py-3">Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="odd:bg-white even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                {user.id}
                                            </td>
                                            <td className="px-6 py-4">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">{user.address}</td>
                                          
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div>No data</div>
                        )}
                    </div>
                </div>
                
            </div>
        </>
    )
    
}

export default Home