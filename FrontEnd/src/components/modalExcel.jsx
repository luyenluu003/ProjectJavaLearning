import React, { useState } from 'react';
import { toast } from 'react-toastify';
import UsersService from '../service/usersService';

const ModalExcel = ({ openExcelModal, setOpenExcelModal, onUpdateSuccess }) => {
    const [file, setFile] = useState(null);

    const handleClose = () => {
        setOpenExcelModal({ isShown: false });
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleImportFileExcel = async () => {
        if (!file) {
            toast.error('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await UsersService.importFileExcel(formData, token);
            toast.success(response.message);
            handleClose();
            onUpdateSuccess();
        } catch (err) {
            toast.error('Error importing file');
        }
    };

    const handleExportFileExcel = async () => {
        // Implement export functionality here
        // Example:
        // try {
        //     const token = localStorage.getItem('token');
        //     const response = await UsersService.exportFileExcel(token);
        //     // Handle the export response (e.g., download the file)
        //     toast.success('File exported successfully');
        // } catch (err) {
        //     toast.error('Error exporting file');
        // }
    };

    return (
        <>
            <div className={`fixed inset-0 z-50 ${openExcelModal.isShown ? '' : 'hidden'} flex items-center justify-center`}>
                <div className="fixed inset-0 bg-black opacity-50" onClick={handleClose}></div>
                <div className="relative p-4 w-full max-w-lg max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                            Excel
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
                            Select input or export excel file.
                        </p>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="file:bg-gradient-to-b file:from-primary file:to-primary/80 file:px-6 file:py-3 w-full file:m-2 file:border-none file:rounded-full file:text-white file:cursor-pointer file:shadow-lg file:shadown-primary/50 bg-gradient-to-br from-dark-grey to-gray text-white/80 rounded-full cursor-pointer shadow-xl "
                        />
                    </div>
                    <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray justify-between">
                        <button
                            onClick={handleExportFileExcel}
                            type="button"
                            className="text-white bg-[#A5F703] transform transition-transform duration-300 hover:scale-105 focus:ring-4 focus:outline-none focus:ring-[#A5F703]/30 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#A5F703] dark:focus:ring-[#A5F703]/30"
                        >
                            Export
                        </button>
                        <button
                            onClick={handleImportFileExcel}
                            type="button"
                            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-red rounded-lg transform transition-transform duration-300 hover:scale-105 focus:z-10 focus:ring-4 focus:ring-red dark:focus:ring-red/60 dark:bg-red dark:text-white dark:border-red/60"
                        >
                            Import
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalExcel;
