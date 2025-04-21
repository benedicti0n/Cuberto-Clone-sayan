"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

interface ExpertiseFormData {
  title: string;
  description: string;
  icon: string;
  backgroundImage: string;
  proficiencyLevel: number;
  learnMoreLink: string;
  _id?: string;
}

export default function ExpertiseManager() {
  const [skills, setSkills] = useState<ExpertiseFormData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ExpertiseFormData>({
    title: "",
    description: "",
    icon: "",
    backgroundImage: "",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update skill
        const res = await axios.put(
          `${serverUrl}/expertise/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.status !== 200) throw new Error("Failed to update skill");

        setSkills((prev) =>
          prev.map((skill) =>
            skill._id === editingId ? res.data : skill
          )
        );
      } else {
        // Add new skill
        const res = await axios.post(
          `${serverUrl}/expertise/addExpertise`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const createdSkill = res.data.expertise;
        setSkills((prev) => [...prev, createdSkill]);
      }

      setIsAdding(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error submitting skill:", error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEdit = (skill: ExpertiseFormData) => {
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
    }
  };

  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const res = await axios.get(`${serverUrl}/expertise/all`);
        setSkills(res.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
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
            <label className="block font-medium">Background Image URL:</label>
            <input
              type="text"
              name="backgroundImage"
              value={formData.backgroundImage}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 mt-1"
              placeholder="Enter image URL"
            />
            {formData.backgroundImage && (
              <img
                src={formData.backgroundImage}
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {editingId ? "Update Skill" : "Add Skill"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
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
                    backgroundImage: `url(${skill.backgroundImage})`,
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
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id!)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
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
