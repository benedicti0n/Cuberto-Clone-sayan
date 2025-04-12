"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";

const CHAR_LIMIT = 100;
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const Tagline = () => {
    const [editingTagline, setEditingTagline] = useState(false);
    const [taglineForm, setTaglineForm] = useState("");
    const [autoCorrectEnabled, setAutoCorrectEnabled] = useState(true);
    const [taglineCharCounts, setTaglineCharCounts] = useState<number[]>([]);
    const [content, setContent] = useState<{ tagline: string }>({ tagline: "" });

    useEffect(() => {
        const fetchTagline = async () => {
            try {
                const res = await axios.get(`${serverUrl}/verifiedManager/fetchTagline`);
                setContent({ tagline: res.data.tagline || "" });
            } catch (err) {
                console.error("Error fetching tagline:", err);
            }
        };
        fetchTagline();
    }, []);


    useEffect(() => {
        const lines = taglineForm.split("\n").filter(Boolean);
        const counts = lines.map((line) => line.length);
        setTaglineCharCounts(counts);
    }, [taglineForm]);

    const handleEditTagline = () => {
        setTaglineForm(content.tagline);
        setEditingTagline(true);
    };

    const handleTaglineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = e.target.value;
        if (autoCorrectEnabled) {
            const corrected = value
                .split("\n")
                .flatMap((line) => {
                    if (line.length <= CHAR_LIMIT) return [line];
                    const words = line.split(" ");
                    let lines: string[] = [];
                    let current = "";
                    for (const word of words) {
                        if ((current + " " + word).trim().length > CHAR_LIMIT) {
                            lines.push(current.trim());
                            current = word;
                        } else {
                            current += " " + word;
                        }
                    }
                    if (current.trim()) lines.push(current.trim());
                    return lines;
                })
                .join("\n");
            setTaglineForm(corrected);
        } else {
            setTaglineForm(value);
        }
    };

    const handleSaveTagline = async () => {
        try {
            await axios.post(`${serverUrl}/verifiedManager/addTagline`, { tagline: taglineForm });
            setContent({ tagline: taglineForm });
            setEditingTagline(false);
        } catch (err) {
            console.error("Error saving tagline:", err);
        }
    };

    const getCharCountClass = (count: number) => {
        if (count > CHAR_LIMIT * 1.5) return "text-red-500";
        if (count > CHAR_LIMIT) return "text-yellow-500";
        return "text-green-600";
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tagline</h3>
                {!editingTagline && (
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={handleEditTagline}
                    >
                        Edit
                    </button>
                )}
            </div>

            {editingTagline ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Enter your tagline text. Only <code>&lt;strong&gt;</code> tags are allowed for formatting. Press
                        Enter for line breaks. Leave empty if you want this section to be blank.
                        <br />
                        <span className="text-xs text-gray-500">
                            Recommended: Keep each line under {CHAR_LIMIT} characters for better visual appearance.
                        </span>
                    </p>

                    <label className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            checked={autoCorrectEnabled}
                            onChange={() => setAutoCorrectEnabled(!autoCorrectEnabled)}
                            className="accent-blue-600"
                        />
                        <span>
                            Auto-correct line breaks (automatically adds line breaks when text exceeds {CHAR_LIMIT} characters)
                        </span>
                    </label>

                    <textarea
                        className="w-full border border-gray-300 rounded p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={taglineForm}
                        onChange={handleTaglineChange}
                        rows={3}
                        placeholder="Enter tagline text"
                    />

                    {taglineCharCounts.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium mb-1">Line Length Analysis:</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1">
                                {taglineCharCounts.map((count, index) => (
                                    <li key={index} className={getCharCountClass(count)}>
                                        Line {index + 1}: {count} characters
                                        {count > CHAR_LIMIT && count <= CHAR_LIMIT * 1.5 && " (Getting long)"}
                                        {count > CHAR_LIMIT * 1.5 && " (Too long - consider breaking up)"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="flex justify-end space-x-2">
                        <button
                            className="px-4 py-1 rounded border border-gray-300 hover:bg-gray-100"
                            onClick={() => setEditingTagline(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-1 rounded bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleSaveTagline}
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <div className="prose prose-sm">
                    {content.tagline ? (
                        content.tagline.split("\n").map((line, i) => (
                            <p key={i} dangerouslySetInnerHTML={{ __html: line }} />
                        ))
                    ) : (
                        <p className="text-gray-400 italic">No tagline added yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Tagline;