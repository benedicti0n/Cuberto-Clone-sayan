import React, { useEffect, useState } from 'react';
import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface Submission {
    _id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    createdAt: string;
}

const ContactFormSection = () => {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSubmissions = async () => {
        try {
            const res = await axios.get(`${serverUrl}/contactForm/fetchAll`);
            setSubmissions(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching contact form data:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${serverUrl}/contactForm/delete/${id}`);
            // Refresh the submissions list after deletion
            fetchSubmissions();
        } catch (err) {
            console.error("Error deleting submission:", err);
            alert("Failed to delete submission. Please try again.");
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-600">Loading submissions...</div>;
    }

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {submissions.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">No submissions yet.</div>
            ) : (
                submissions.map((submission) => (
                    <div
                        key={submission._id}
                        className="border rounded-lg p-4 shadow-md bg-white relative"
                    >
                        <h2 className="text-lg font-semibold text-blue-600">{submission.name}</h2>
                        <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {submission.email}</p>
                        <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {submission.phone}</p>
                        <p className="text-sm text-gray-600 mb-1"><strong>Subject:</strong> {submission.subject}</p>
                        <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">{submission.message}</p>
                        <p className="text-xs text-gray-400 mt-3 text-right">
                            Submitted on {new Date(submission.createdAt).toLocaleString()}
                        </p>
                        <button
                            onClick={() => handleDelete(submission._id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            title="Delete submission"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ContactFormSection;
