import NavBar from "../components/navbar";
import { useState, useEffect } from "react";
import UsersService from "../service/usersService";
import ModalEditAdd from "../components/modalEditAdd";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        data: null,
        type: null,
    });

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await UsersService.getYourProfile(token);
            setUser(response.ourUsers);
            console.log("User:", response.ourUsers);
        } catch (error) {
            console.log("Error fetching user:", error);
            setError("Error fetching user data.");
        } finally {
            setLoading(false);
        }
    };

    const refreshUserData = async () => {
        await fetchUser(); 
    };

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <p>{error}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <p>No user data available.</p>
            </div>
        );
    }

    return (
        <>
            <div className="h-screen w-full overflow-hidden">
                <NavBar />
                <div className="flex justify-center mt-20 h-full">
                    <div className="max-w-max w-full h-80 bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thông Tin Cá Nhân</h2>
                            <div className="mb-4 flex items-center">
                                <h3 className="text-lg font-semibold text-gray-700 mr-3">ID:</h3>
                                <p className="text-gray-600">{user.id}</p>
                            </div>
                            <div className="mb-4 flex items-center">
                                <h3 className="text-lg font-semibold text-gray-700 mr-3">Name:</h3>
                                <p className="text-gray-600">{user.name}</p>
                            </div>
                            <div className="mb-4 flex items-center">
                                <h3 className="text-lg font-semibold text-gray-700 mr-3">Email:</h3>
                                <p className="text-gray-600">{user.email}</p>
                            </div>
                            <div className="mb-4 flex items-center">
                                <h3 className="text-lg font-semibold text-gray-700 mr-3">Address:</h3>
                                <p className="text-gray-600">{user.address}</p>
                            </div>
                            <button className="btn btn-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                                setOpenAddEditModal({
                                    isShown: true,
                                    data: user.id,
                                    type: "edit",
                                });
                            }}>EDIT</button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalEditAdd 
                openAddEditModal={openAddEditModal} 
                setOpenAddEditModal={setOpenAddEditModal} 
                data={openAddEditModal.data} 
                type={openAddEditModal.type}
                onUpdateSuccess={refreshUserData} 
            />
        </>
    );
};

export default Profile;
