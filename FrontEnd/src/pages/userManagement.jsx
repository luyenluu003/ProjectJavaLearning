import { useEffect, useState } from "react"
import NavBar from "../components/navbar"
import UsersService from "../service/usersService"
import { MdAdd } from "react-icons/md"
import ModalDelete from "../components/modalDelete"
import ModalEditAdd from "../components/modalEditAdd"
import { FaRegFileExcel } from "react-icons/fa6";
import ModalExcel from "../components/modalExcel"
import { toast } from "react-toastify"

const UserManagement = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [allUsers, setAllUsers] = useState([])
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        data: null,
        type: null,
    });

    const [openDeleteModal, setOpenDeleteModal] = useState({
        isShown: false,
        data: null,
        type: null,
    });

    const [openExcelModal, setOpenExcelModal] = useState({
        isShown: false,
    });
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
    const refreshUserData = async () => {
        await fetchAllUser();
    };

    const lockUser = async (userId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await UsersService.lockUser(userId, token)
            toast.success("User locked successfully")
            await refreshUserData();
        } catch (error) {
            toast.error("Error locking user")
            console.log("error lock user", error)
        }
    }

    const unLockUser = async (userId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await UsersService.unLockUser(userId, token)
            toast.success("User unlocked successfully")
            await refreshUserData();
        } catch (error) {
            toast.error("Error unlocking user")
            console.log("error unlock user", error)
        }
    }


    useEffect(() => {
        fetchAllUser()
        setIsLoading(false)
    }, [])
    return (
        <> <>
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
                                        <th scope="col" className="px-6 py-3">Status</th>
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
                                            <td className="px-6 py-4 ">
                                                <div className="flex items-center space-x-2 w-auto">
                                                    {!user.accountNonLocked == true ? (
                                                        <>
                                                            <div className="w-[20px] h-[20px] rounded-full bg-red block" aria-hidden="true"></div>
                                                            <span className="">Khóa</span>
                                                            {console.log("user.accountNonLocked ", user.accountNonLocked)}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-[20px] h-[20px] rounded-full bg-[#A5F703] block" aria-hidden="true"></div>
                                                            <span className="">Hoạt động</span>
                                                        </>
                                                    )}
                                                </div>

                                            </td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button
                                                    className="font-medium text-blue-600 dark:text-blue-500 btn-primary"
                                                    onClick={() => {
                                                        setOpenAddEditModal({
                                                            isShown: true,
                                                            type: "edit",
                                                            data: user.id
                                                        })
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="font-medium text-red-600 dark:text-red-500 btn-red"
                                                    onClick={() => {
                                                        setOpenDeleteModal({
                                                            isShown: true,
                                                            type: "delete",
                                                            data: user.id
                                                        })
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                                {!user.accountNonLocked ? (
                                                    <button
                                                        className="font-medium btn-yellow"
                                                        onClick={() => unLockUser(user.id)}
                                                    >
                                                        Active
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="font-medium btn-red"
                                                        onClick={() => lockUser(user.id)}
                                                    >
                                                        Lock
                                                    </button>
                                                )}
                                            </td>

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
            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-800 absolute right-10 bottom-10" onClick={() => {
                setOpenAddEditModal({
                    isShown: true,
                    type: "add",
                    data: null
                })
            }}>
                <MdAdd className="text-[32px] text-white" />
            </button>
            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-[#A5F703] hover:bg-[#A5F703]/80 absolute left-10 bottom-10" onClick={() => {
                setOpenExcelModal({
                    isShown: true,
                })
            }}>
                <FaRegFileExcel className="text-[32px] text-white" />
            </button>

        </>
            <ModalEditAdd
                openAddEditModal={openAddEditModal}
                setOpenAddEditModal={setOpenAddEditModal}
                data={openAddEditModal.data}
                type={openAddEditModal.type}
                onUpdateSuccess={refreshUserData}
            />
            <ModalDelete
                openDeleteModal={openDeleteModal}
                setOpenDeleteModal={setOpenDeleteModal}
                data={openDeleteModal.data}
                type={openDeleteModal.type}
                onUpdateSuccess={refreshUserData}
            />
            <ModalExcel
                openExcelModal={openExcelModal}
                setOpenExcelModal={setOpenExcelModal}
                onUpdateSuccess={refreshUserData}
            />
        </>
    )
}

export default UserManagement