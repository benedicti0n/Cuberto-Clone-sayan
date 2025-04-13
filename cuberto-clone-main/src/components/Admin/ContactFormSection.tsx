import React, { useEffect, useState } from 'react';
import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const ContactFormSection = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await axios.get(`${serverUrl}/contactForm/fetchAll`); // Update to match your backend URL
                setSubmissions(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching contact form data:", err);
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

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
                        // @ts-expect-error any-type
                        key={submission._id}
                        className="border rounded-lg p-4 shadow-md bg-white"
                    >
                        {/* @ts-expect-error any-type */}
                        <h2 className="text-lg font-semibold text-blue-600">{submission.name}</h2>
                        {/* @ts-expect-error any-type */}
                        <p className="text-sm text-gray-600 mb-1"><strong>Email:</strong> {submission.email}</p>
                        {/* @ts-expect-error any-type */}
                        <p className="text-sm text-gray-600 mb-1"><strong>Phone:</strong> {submission.phone}</p>
                        {/* @ts-expect-error any-type */}
                        <p className="text-sm text-gray-600 mb-1"><strong>Subject:</strong> {submission.subject}</p>
                        {/* @ts-expect-error any-type */}
                        <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">{submission.message}</p>
                        <p className="text-xs text-gray-400 mt-3 text-right">
                            {/* @ts-expect-error any-type */}
                            Submitted on {new Date(submission.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
};

export default ContactFormSection;
