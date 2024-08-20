import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import UsersService from '../service/usersService';

const ModalDelete = ({ openDeleteModal, setOpenDeleteModal, data, type, onUpdateSuccess }) => {
    const handleClose = () => {
        setOpenDeleteModal({ isShown: false, data: null, type: null });
    };


    const deleteUser = async () => {
        try {
            const token = localStorage.getItem('token');
            await UsersService.deleteUser(data, token);
            toast.success("User deleted successfully");
            handleClose();
            onUpdateSuccess();
        } catch (error) {
            console.log("Error deleting user:", error);
            toast.error("Error deleting user");
        }
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 ${openDeleteModal.isShown ? '' : 'hidden'} flex items-center justify-center`}>
                <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
                <div className="relative p-4 w-full max-w-lg max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                            Delete User
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-primary hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleClose}
                        >
                            <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray justify-between">
                        <button
                            onClick={() => {
                                deleteUser();
                            }}
                            type="button"
                            className="text-white bg-red hover:bg-red/80 focus:ring-4 focus:outline-none focus:ring-red/30 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red dark:hover:bg-red/80 dark:focus:ring-red-30"
                        >
                            Delete
                        </button>
                        <button
                            onClick={handleClose}
                            type="button"
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-primary rounded-lg  hover:bg-gray hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray dark:focus:ring-gray/45 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalDelete;
