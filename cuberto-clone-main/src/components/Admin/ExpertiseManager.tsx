"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

type ImageData = {
  type: "Buffer";
  data: number[];
};

interface ExpertiseFormData {
  title: string;
  description: string;
  icon: string;
  backgroundImage?: string | any;
  proficiencyLevel: number;
  learnMoreLink: string;
  imageData?: ImageData | null;
  _id?: string;
}

export default function ExpertiseManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<ExpertiseFormData>({
    title: "",
    description: "",
    icon: "",
    backgroundImage: "",
    imageData: null,
    proficiencyLevel: 0,
    learnMoreLink: "",
  });

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      icon: "",
      backgroundImage: "",
      proficiencyLevel: 0,
      learnMoreLink: "",
    });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const uploadFormData = new FormData();

      if (selectedFile) {
        uploadFormData.append("image", selectedFile);
      }
      uploadFormData.append("title", formData.title);
      uploadFormData.append("description", formData.description);
      uploadFormData.append("icon", formData.icon);
      uploadFormData.append("proficiencyLevel", formData.proficiencyLevel.toString());
      uploadFormData.append("learnMoreLink", formData.learnMoreLink);
      uploadFormData.append("backgroundImage", formData.backgroundImage);

      if (editingId) {
        // 🛠️ Update skill
        const res = await axios.put(
          `${serverUrl}/expertise/${editingId}`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(progress);
              }
            },
          }
        );

        if (res.status !== 200) throw new Error("Failed to update skill");

        setSkills((prev) =>
          prev.map((skill) =>
            skill.id === editingId || skill._id === editingId
              ? { ...res.data, id: res.data._id }
              : skill
          )
        );
      } else {
        // Add new skill
        const res = await axios.post(
          `${serverUrl}/expertise/addExpertise`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(progress);
              }
            },
          }
        );

        const createdSkill = res.data;
        setSkills((prev) => [...prev, createdSkill]);
      }

      setIsAdding(false);
      setEditingId(null);
      setSelectedFile(null);
      setUploadingImage(false);
    } catch (error) {
      console.error("Error submitting skill:", error);
      setUploadingImage(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (skill: any) => {
    setFormData(skill);
    setEditingId(skill._id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${serverUrl}/expertise/${id}`);

      if (res.status === 200) {
        setSkills((prev) => prev.filter((skill) => skill._id !== id));
      } else {
        console.error("Failed to delete skill:", res.statusText);
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      // Optionally: show toast or error message
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // If it's a URL input (not a file upload)
    if (typeof file === "string") {
      setFormData((prev) => ({
        ...prev,
        backgroundImage: file,
      }));
      return;
    }

    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      backgroundImage: URL.createObjectURL(file)
    }));
  };

  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const res = await axios.get(`${serverUrl}/expertise/all`);
        // @ts-expect-error any-type
        setSkills(res.data.map((item) => ({ ...item, id: item._id })));
      } catch (error) {
        console.error("Error fetching skills:", error);
        // Optional: toast error
      }
    };

    fetchExpertise();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Expertise Manager</h2>

      {!isAdding && !editingId && (
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Skill
        </button>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block font-medium">Skill Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Font Awesome Icon Code:</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              required
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Background Image:</label>
            <div className="flex items-center gap-4">
              <input
                type="text"
                name="backgroundImage"
                value={formData.backgroundImage}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
                placeholder="Enter image URL or upload"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                disabled={uploadingImage}
              >
                {uploadingImage ? "Uploading..." : "Upload"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            {uploadingImage && (
              <div className="w-full bg-gray-200 h-3 mt-2 rounded">
                <div
                  className="h-3 bg-green-500 rounded"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            {formData.backgroundImage && (
              // eslint-disable-next-line
              <img
                src={
                  formData?.backgroundImage?.startsWith("http")
                    ? formData.backgroundImage
                    : formData.imageData?.data
                      ? `data:image/png;base64,${Buffer.from(
                        formData.imageData.data
                      ).toString("base64")}`
                      : `${serverUrl}/expertise/image/${formData._id}`
                }
                alt="Preview"
                className="mt-2 rounded-md max-h-40 object-cover"
              />
            )}
          </div>

          <div>
            <label className="block font-medium">Proficiency Level (%):</label>
            <input
              type="number"
              name="proficiencyLevel"
              value={formData.proficiencyLevel}
              onChange={handleInputChange}
              min={0}
              max={100}
              required
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>

          <div>
            <label className="block font-medium">Learn More Link:</label>
            <input
              type="text"
              name="learnMoreLink"
              value={formData.learnMoreLink}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              {editingId ? "Update Skill" : "Add Skill"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {skills.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Current Skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div
                  className="h-32 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${skill.backgroundImage?.startsWith("http")
                      ? skill.backgroundImage
                      : skill.imageData?.data
                        ? `data:image/png;base64,${Buffer.from(
                          skill.imageData.data
                        ).toString("base64")}`
                        : `${serverUrl}/expertise/image/${skill._id}`
                      })`,
                  }}
                ></div>
                <div className="p-4">
                  <h4 className="text-lg font-bold">{skill.title}</h4>
                  <p className="text-gray-600 text-sm">{skill.description}</p>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <i className={`fa ${skill.icon} text-xl`} />
                    <span>{skill.proficiencyLevel}%</span>
                  </div>
                  {skill.learnMoreLink && (
                    <a
                      href={skill.learnMoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline block mt-2"
                    >
                      Learn More
                    </a>
                  )}
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
