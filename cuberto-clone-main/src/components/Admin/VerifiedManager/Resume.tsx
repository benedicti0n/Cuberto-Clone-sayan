import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const Resume = () => {
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const { data } = await axios.get(`${serverUrl}/resume/getResume`, {
                    responseType: 'blob',
                });
                if (data) {
                    const url = URL.createObjectURL(data);
                    setResumeUrl(url);
                }
            } catch (error) {
                console.error('Failed to fetch resume:', error);
                setResumeUrl(null);
            }
        };

        fetchResume();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            alert('Please upload a PDF file');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);
            await axios.post(`${serverUrl}/resume/addResume`, formData);
            const url = URL.createObjectURL(selectedFile);
            setResumeUrl(url);
            setSelectedFile(null);
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${serverUrl}/resume/deleteResume`);
            setResumeUrl(null);
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mb-4">Resume</h3>

            {resumeUrl ? (
                <div className="space-y-4">
                    <iframe
                        src={resumeUrl}
                        title="Resume PDF"
                        className="w-full h-[500px] border rounded"
                    />
                    <div className="flex gap-4 flex-wrap">
                        <a
                            href={resumeUrl}
                            download="Resume.pdf"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Download Resume
                        </a>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete Resume
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 italic mb-4">No resume uploaded yet.</p>
            )}

            <div className="mt-6 space-y-4">
                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="resumeUpload"
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer px-4 py-2 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 inline-block"
                >
                    Select PDF
                </label>
                <span className="text-sm text-gray-600">
                    {selectedFile?.name || 'No file selected'}
                </span>

                <div>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className={`mt-2 px-4 py-2 rounded text-white ${!selectedFile || isUploading
                            ? 'bg-blue-300 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isUploading ? 'Uploading...' : 'Upload Resume'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Resume;
