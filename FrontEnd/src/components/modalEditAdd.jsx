import { useEffect, useState } from "react";
import UsersService from "../service/usersService";
import { toast } from "react-toastify";

const ModalEditAdd = ({ openAddEditModal, setOpenAddEditModal, data, type, onUpdateSuccess }) => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");

    const isAdmin = UsersService.isAdmin(); 

    const handleClose = () => {
        setOpenAddEditModal({ isShown: false, data: null, type: null });
    };

    const fetchUser = async () => {
        try {
            if (data) {
                const token = localStorage.getItem('token');
                const response = await UsersService.getUserId(token, data);
                setUser(response.ourUsers);
            }
        } catch (error) {
            console.log("Error fetching user:", error);
            toast.error("Error fetching user details.");
        }
    };

    useEffect(() => {
        if (data && type === "edit") {
            fetchUser();
        }
    }, [data, type]);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setPassword(""); 
            setAddress(user.address || "");
            setRole(user.role || "");
        }
    }, [user]);

    const updateUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const userData = { name, email, password, role, address };
            await UsersService.updateUser(data, userData, token);
            toast.success("User updated successfully");
            handleClose();
            onUpdateSuccess();
        } catch (error) {
            console.log("Error updating user:", error);
            toast.error("Error updating user");
        }
    };

    const addUser = async () => {
        if (!name || !email || !password || !address || !role) {
            toast.error("Please fill in all fields.");
            return;
        }
        const userData = {
            name,
            email,
            password,
            address,
            role
        };
        try {
            const token = localStorage.getItem('token');
            await UsersService.register(userData, token);
            toast.success("User added successfully");
            handleClose();
            onUpdateSuccess();
        } catch (error) {
            console.log("Error adding user:", error);
            toast.error("Error adding user. Please try again.");
        }
    };

    const handleAddEditUser = () => {
        if (!name || !email || !password || !address || (type === "add" && !role)) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (type === "edit") {
            updateUser();
        } else {
            addUser();
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 flex items-center justify-center ${openAddEditModal.isShown ? '' : 'hidden'}`}>
                <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
                <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-black dark:text-black">
                            {type === "edit" ? "EDIT USER" : "ADD USER"}
                        </h3>
                        <button
                            type="button"
                            className="text-gray hover:bg-primary hover:text-white rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-primary dark:hover:text-white"
                            onClick={handleClose}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className="p-4 md:p-5">
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-black dark:text-black">Email:</label>
                            <input
                                type="email"
                                id="email"
                                className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                                value={email}
                                onChange={({ target }) => setEmail(target.value)}
                                disabled={type === 'edit'}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 mt-2 text-sm font-medium text-black dark:text-black">Password:</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter password"
                                className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                                value={password}
                                onChange={({ target }) => setPassword(target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="name" className="block mb-2 mt-2 text-sm font-medium text-black dark:text-black">Name:</label>
                            <input
                                type="text"
                                id="name"
                                className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                                value={name}
                                onChange={({ target }) => setName(target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block mb-2 mt-2 text-sm font-medium text-black dark:text-black">Address:</label>
                            <input
                                type="text"
                                id="address"
                                className="bg-gray-50 border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400"
                                value={address}
                                onChange={({ target }) => setAddress(target.value)}
                                required
                            />
                        </div>
                        {isAdmin && (
                            <div>
                                <label htmlFor="role" className="block mb-2 mt-2 text-sm font-medium text-black dark:text-black">Role:</label>
                                <select
                                    id="role"
                                    value={role}
                                    onChange={({ target }) => setRole(target.value)}
                                    className="bg-white border border-black text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-black"
                                    required
                                >
                                    <option value="">Select a role</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="USER">USER</option>
                                </select>
                            </div>
                        )}
                        <button
                            type="button"
                            className="text-white inline-flex  items-center bg-primary hover:bg-blue-gwen focus:ring-4 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-blue-gwen dark:focus:ring-primary mt-5"
                            onClick={handleAddEditUser}
                        >
                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                            </svg>
                            {type === "edit" ? "Update User" : "Add New User"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ModalEditAdd;
