'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const ProfilePhoto = ({ onPhotoUpdate }: { onPhotoUpdate?: (url: string | null) => void }) => {
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [editingPhoto, setEditingPhoto] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                const response = await axios.get(`${serverUrl}/profilePhoto/get`, {
                    responseType: 'blob',
                });

                const imageBlob = response.data;
                const imageUrl = URL.createObjectURL(imageBlob);
                setPhotoUrl(imageUrl);
            } catch (err) {
                console.error('Failed to fetch profile photo:', err);
                setPhotoUrl(null);
            }
        };

        fetchPhoto();

        // Cleanup the Object URL on unmount
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
        // eslint-disable-next-line
    }, []);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUploadPhoto = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);

            const { data } = await axios.post(`${serverUrl}/profilePhoto/addProfilePhoto`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setPhotoUrl(data.url);
            onPhotoUpdate?.(data.url);
            setEditingPhoto(false);
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (err: any) {
            setUploadError(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeletePhoto = async () => {
        setIsUploading(true);
        setUploadError(null);

        try {
            await axios.delete(`${serverUrl}/profilePhoto`);
            setPhotoUrl(null);
            onPhotoUpdate?.(null);
            setEditingPhoto(false);
        } catch (err: any) {
            setUploadError(err?.response?.data?.message || 'Delete failed');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Profile Photo</h3>

            {!editingPhoto ? (
                <div className="border p-4 rounded-md shadow-sm bg-white">
                    <div className="mb-4">
                        {photoUrl ? (
                            // eslint-disable-next-line
                            <img
                                src={photoUrl}
                                alt="Profile"
                                className="max-w-full max-h-[200px] object-cover rounded"
                            />
                        ) : (
                            <div className="text-gray-500 italic text-sm border border-dashed p-6 rounded-md text-center">
                                No profile photo added yet.
                            </div>
                        )}
                    </div>

                    {photoUrl && (
                        <div className="mb-3">
                            <a
                                href={photoUrl}
                                download="Profile_Photo.jpg"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Download Photo
                            </a>
                        </div>
                    )}

                    <button
                        onClick={() => setEditingPhoto(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Change Photo
                    </button>
                </div>
            ) : (
                <div className="space-y-4 border p-4 rounded-md shadow-sm bg-white">
                    {previewUrl && (
                        // eslint-disable-next-line
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-[200px] object-cover rounded"
                        />
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="relative">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                                id="photoUpload"
                            />
                            <label
                                htmlFor="photoUpload"
                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium text-gray-800 transition"
                            >
                                Select Photo
                            </label>
                        </div>
                        <span className="text-sm text-gray-600">
                            {selectedFile ? selectedFile.name : 'No file selected'}
                        </span>
                    </div>

                    {uploadError && (
                        <div className="text-red-600 text-sm">{uploadError}</div>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleUploadPhoto}
                            disabled={isUploading || !selectedFile}
                            className={`px-4 py-2 rounded text-white transition ${isUploading || !selectedFile
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Photo'}
                        </button>

                        {photoUrl && (
                            <button
                                onClick={handleDeletePhoto}
                                disabled={isUploading}
                                className={`px-4 py-2 rounded transition ${isUploading
                                    ? 'bg-red-300 cursor-not-allowed text-white'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                            >
                                Delete Photo
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setEditingPhoto(false);
                                setSelectedFile(null);
                                setPreviewUrl(null);
                                setUploadError(null);
                            }}
                            disabled={isUploading}
                            className={`px-4 py-2 rounded transition ${isUploading
                                ? 'bg-gray-300 cursor-not-allowed text-gray-700'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                }`}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePhoto;
