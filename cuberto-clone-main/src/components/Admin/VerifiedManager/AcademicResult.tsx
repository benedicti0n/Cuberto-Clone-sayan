import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const AcademicResult = () => {
    const [addingResult, setAddingResult] = useState(false)
    const [editingResultId, setEditingResultId] = useState(null)
    const [resultForm, setResultForm] = useState({ title: '' })
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [uploadError, setUploadError] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [results, setResults] = useState([])

    const fileInputRef = useRef(null)

    useEffect(() => {
        fetchResults()
    }, [])

    console.log(results);


    const fetchResults = async () => {
        try {
            const res = await axios.get(`${serverUrl}/academic/getAll`) // You'll need this backend route
            setResults(res.data)
        } catch (err) {
            console.error('Failed to fetch results', err)
        }
    }

    const handleAddResult = () => {
        setAddingResult(true)
        setResultForm({ title: '' })
        setSelectedFile(null)
        setPreviewUrl(null)
    }

    const handleResultFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedFile(file)
            if (file.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(file))
            } else {
                setPreviewUrl(null)
            }
        }
    }

    const handleSaveResult = async () => {
        if (!resultForm.title || !selectedFile) {
            setUploadError('Title and file are required.')
            return
        }

        const formData = new FormData()
        formData.append('title', resultForm.title)
        formData.append('file', selectedFile)

        try {
            setIsUploading(true)
            setUploadError(null)

            if (editingResultId) {
                await axios.put(`${serverUrl}/academic/edit/${editingResultId}`, formData)
            } else {
                await axios.post(`${serverUrl}/academic/add`, formData)
            }

            fetchResults()
            resetForm()
        } catch (err) {
            setUploadError('Upload failed. Try again.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleEditResult = (result) => {
        setEditingResultId(result._id)
        setResultForm({ title: result.title })
    }

    const handleDeleteResult = async (id) => {
        if (confirm('Are you sure you want to delete this result?')) {
            try {
                await axios.delete(`${serverUrl}/academic/delete/${id}`)
                fetchResults()
            } catch (err) {
                console.error('Delete failed', err)
            }
        }
    }

    const resetForm = () => {
        setAddingResult(false)
        setEditingResultId(null)
        setSelectedFile(null)
        setPreviewUrl(null)
        setResultForm({ title: '' })
        setUploadError(null)
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Academic Results</h3>

            {!addingResult && !editingResultId && (
                <div className="mb-6">
                    <button
                        onClick={handleAddResult}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Add New Result
                    </button>
                </div>
            )}

            {(addingResult || editingResultId) && (
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h4 className="text-lg font-medium mb-4">{editingResultId ? 'Edit Result' : 'Add New Result'}</h4>

                    <label className="block mb-2 font-medium">Title:</label>
                    <input
                        type="text"
                        value={resultForm.title}
                        onChange={(e) => setResultForm({ ...resultForm, title: e.target.value })}
                        className="w-full p-2 border rounded mb-4"
                    />

                    <label className="block mb-2 font-medium">Upload File (Image or PDF):</label>
                    {previewUrl && (
                        <div className="mb-4">
                            <img src={previewUrl} alt="Preview" className="max-w-full max-h-48 object-contain" />
                        </div>
                    )}
                    <div className="flex items-center gap-4 mb-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleResultFileChange}
                            accept="image/*,application/pdf"
                            className="hidden"
                            id="resultFileUpload"
                        />
                        <label htmlFor="resultFileUpload" className="cursor-pointer px-4 py-2 bg-gray-200 rounded">
                            Select File
                        </label>
                        <span>{selectedFile ? selectedFile.name : 'No file selected'}</span>
                    </div>

                    {uploadError && (
                        <div className={`mb-4 ${uploadError.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                            {uploadError}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={handleSaveResult}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            disabled={isUploading}
                        >
                            {editingResultId ? 'Update Result' : 'Add Result'}
                        </button>
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div>
                <h4 className="text-lg font-medium mb-4">Existing Results</h4>
                <div className="grid gap-4 md:grid-cols-2">
                    {results.map((result) => (
                        <div key={result._id} className="bg-white p-4 rounded shadow">
                            <h5 className="text-md font-semibold mb-2">{result.title}</h5>

                            {/* Handle Images */}
                            {result.contentType?.startsWith('image/') && result.fileBuffer && (
                                <img
                                    src={`data:${result.contentType};base64,${result.fileBuffer}`}
                                    alt={result.title}
                                    className="w-full h-48 object-contain mb-2"
                                />
                            )}

                            {/* Handle PDFs */}
                            {result.contentType === 'application/pdf' && result.fileBuffer && (
                                <a
                                    href={`data:${result.contentType};base64,${result.fileBuffer}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    View PDF
                                </a>
                            )}

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleEditResult(result)}
                                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteResult(result._id)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
                {results.length === 0 && <p className="text-gray-600 mt-4">No results added yet.</p>}
            </div>
        </div>
    )
}

export default AcademicResult
