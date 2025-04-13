"use client"

import React, { useEffect, useState } from "react";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const ProjectManagerForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    footerText: "",
    techStack: "",
    technologiesUsed: "",
    projectUrl: "",
    imageUrl: "",
    imageFile: null as File | null,
  });

  const [projects, setProjects] = useState([]);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${serverUrl}/project/getAll`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, imageFile: file }));
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      footerText: "",
      techStack: "",
      technologiesUsed: "",
      projectUrl: "",
      imageUrl: "",
      imageFile: null,
    });
    setEditProjectId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("footerText", formData.footerText);
    data.append("techStack", formData.techStack);
    data.append("technologiesUsed", formData.technologiesUsed);
    data.append("projectUrl", formData.projectUrl);
    data.append("imageUrl", formData.imageUrl);
    if (formData.imageFile) {
      data.append("imageFile", formData.imageFile);
    }

    try {
      const url = editProjectId
        ? `${serverUrl}/project/update/${editProjectId}`
        : `${serverUrl}/project/addProject`;

      const method = editProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: data,
      });

      const result = await res.json();
      console.log("Project saved:", result);
      handleCancel();
      await fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (project: any) => {
    setFormData({
      title: project.title,
      description: project.description,
      footerText: project.footerText,
      techStack: project.techStack,
      technologiesUsed: project.technologiesUsed,
      projectUrl: project.projectUrl,
      imageUrl: project.imageUrl || "",
      imageFile: null,
    });
    setEditProjectId(project._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      await fetch(`${serverUrl}/project/delete/${id}`, {
        method: "DELETE",
      });
      await fetchProjects();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="w-full mx-auto p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Project Manager</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Project Title" className="w-full border p-2 rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
        <input name="footerText" value={formData.footerText} onChange={handleChange} placeholder="Project Footer Text" className="w-full border p-2 rounded" />
        <input name="techStack" value={formData.techStack} onChange={handleChange} placeholder="Technology Stack" className="w-full border p-2 rounded" />
        <input name="technologiesUsed" value={formData.technologiesUsed} onChange={handleChange} placeholder="Technologies Used" className="w-full border p-2 rounded" />
        <input name="projectUrl" value={formData.projectUrl} onChange={handleChange} placeholder="Project URL" className="w-full border p-2 rounded" />
        <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Project Image (URL)" className="w-full border p-2 rounded" />
        <input type="file" onChange={handleFileUpload} className="w-full border p-2 rounded" />

        <div className="flex gap-4">
          <button type="submit" disabled={isSaving} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {editProjectId ? "Update Project" : "Add Project"}
          </button>
          <button type="button" onClick={handleCancel} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </form>

      {isSaving && (
        <div className="mt-6 p-4 bg-gray-100 border rounded shadow-inner">
          <h3 className="font-semibold text-lg mb-2">Saving Preview...</h3>
          <p><strong>Title:</strong> {formData.title}</p>
          <p><strong>Description:</strong> {formData.description}</p>
          <p><strong>Footer:</strong> {formData.footerText}</p>
          <p><strong>Tech Stack:</strong> {formData.techStack}</p>
          <p><strong>Technologies:</strong> {formData.technologiesUsed}</p>
          <p><strong>URL:</strong> {formData.projectUrl}</p>
          {formData.imageUrl && <img src={formData.imageUrl} alt="Project" className="w-64 h-auto mt-2 rounded" />}
        </div>
      )}

      <div className="mt-10 space-y-6">
        {projects.map((project: any) => (
          <div key={project._id} className="border rounded p-4 shadow">
            <h4 className="text-lg font-semibold mb-2">{project.title}</h4>
            <p className="text-sm mb-2">{project.description}</p>
            <p className="text-xs text-gray-600 mb-2">Footer: {project.footerText}</p>
            <p className="text-xs text-gray-600">Stack: {project.techStack}</p>
            <p className="text-xs text-gray-600">Tech: {project.technologiesUsed}</p>
            {project.imageUrl && (
              <img src={project.imageUrl} alt="project" className="w-full mt-2 rounded" />
            )}
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-500 hover:underline text-sm"
            >
              View Project
            </a>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEditClick(project)}
                className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(project._id)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManagerForm;
