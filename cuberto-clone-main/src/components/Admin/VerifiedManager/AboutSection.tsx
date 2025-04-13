'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CHAR_LIMIT = 160;
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const AboutSection = () => {
    const [editingAbout, setEditingAbout] = useState(false);
    const [aboutForm, setAboutForm] = useState('');
    const [aboutCharCounts, setAboutCharCounts] = useState<number[]>([]);
    const [content, setContent] = useState<{ aboutText: string }>({ aboutText: '' });

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await axios.get(`${serverUrl}/verifiedManager/fetchAbout`);
                setContent({ aboutText: res.data.aboutText || '' });
            } catch (err) {
                console.error('Failed to fetch about text', err);
            }
        };
        fetchAbout();
    }, []);

    useEffect(() => {
        const sentences = aboutForm.split(/[.?!]\s+/).filter(Boolean);
        const counts = sentences.map((s) => s.trim().length);
        setAboutCharCounts(counts);
    }, [aboutForm]);

    const handleEditAbout = () => {
        setAboutForm(content.aboutText);
        setEditingAbout(true);
    };

    const handleSaveAbout = async () => {
        try {
            await axios.post(`${serverUrl}/verifiedManager/saveAbout`, {
                aboutText: aboutForm,
            });

            setContent({ aboutText: aboutForm });
            setEditingAbout(false);
        } catch (err) {
            console.error('Save error:', err);
        }
    };

    const getCharCountClass = (count: number) => {
        if (count > CHAR_LIMIT * 1.5) return 'text-red-600 font-semibold';
        if (count > CHAR_LIMIT) return 'text-yellow-600';
        return 'text-green-600';
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">About Text</h3>
                {!editingAbout && (
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={handleEditAbout}
                    >
                        Edit
                    </button>
                )}
            </div>

            {editingAbout ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        You can use HTML tags like &lt;strong&gt;text&lt;/strong&gt; for bold text. Leave empty if you want this
                        section to be blank on the viewer side.
                        <br />
                        <span className="text-xs text-gray-500 italic">
                            Recommended: Keep each sentence under {CHAR_LIMIT} characters for better readability.
                        </span>
                    </p>

                    <textarea
                        className="w-full border border-gray-300 rounded-md p-3 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={aboutForm}
                        onChange={(e) => setAboutForm(e.target.value)}
                        rows={10}
                        placeholder="Enter about text (HTML allowed)"
                    />

                    {aboutCharCounts.length > 0 && (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                            <h4 className="text-md font-medium mb-2">Sentence Length Analysis:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {aboutCharCounts.map((count, index) => (
                                    <li key={index} className={getCharCountClass(count)}>
                                        Sentence {index + 1}: {count} characters
                                        {count > CHAR_LIMIT && count <= CHAR_LIMIT * 1.5 && ' (Getting long)'}
                                        {count > CHAR_LIMIT * 1.5 && ' (Too long - consider breaking up)'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                            onClick={() => setEditingAbout(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={handleSaveAbout}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="prose max-w-none">
                    {content.aboutText ? (
                        <div dangerouslySetInnerHTML={{ __html: content.aboutText }} />
                    ) : (
                        <p className="text-gray-500 italic">No about text added yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AboutSection;
