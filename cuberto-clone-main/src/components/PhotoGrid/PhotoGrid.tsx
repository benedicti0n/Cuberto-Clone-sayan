'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCircleInfo, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
// import { fetchContent, setupContentPolling } from '@/utils/contentSync';

interface Project {
  _id: string;
  title: string;
  description: string;
  footerText: string;
  techStack: string;
  technologiesUsed: string;
  imageUrl: string;
  projectUrl: string;
}

interface PhotoGridProps {
  photos?: Project[];
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const PhotoGrid: React.FC<PhotoGridProps> = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  // eslint-disable-next-line
  const [showSection, setShowSection] = useState(true);
  const [showInfoIndex, setShowInfoIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  //eslint-disable-next-line
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    fetchProjects()
  }, []);

  const toggleInfo = (index: number) => {
    if (isMobile) {
      setShowInfoIndex(showInfoIndex === index ? null : index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (!isMobile) {
      setShowInfoIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setShowInfoIndex(null);
    }
  };

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical md breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Debug current projects
  useEffect(() => {
    console.log('PhotoGrid - Current projects state:', projects);
  }, [projects]);

  // Debug image loading
  useEffect(() => {
    if (projects && projects.length > 0) {
      projects.forEach(project => {
        if (project.imageUrl) {
          console.log(`Project image for ${project.title}: ${project.imageUrl.substring(0, 50)}...`);
        }
      });
    }
  }, [projects]);

  // Use only inline SVG data URL as fallback
  const DEFAULT_PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';

  // Prevent flicker-inducing re-renders when content hasn't changed
  //eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedProjects = useMemo(() => projects, [projects.map(p => p._id).join(',')]);

  if (!showSection) {
    return null;
  }

  return (
    <section className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {memoizedProjects.map((project, index) => (
          <div
            key={project._id}
            className="relative overflow-hidden transition-all duration-300 hover:opacity-95 h-[500px] md:h-[500px] lg:h-[650px] xl:h-[585px]"
          >
            <div className="absolute inset-0 flex items-center justify-center z-0">
              {project.imageUrl ? (
                // eslint-disable-next-line
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-contain transition-all duration-500"
                  loading="lazy"
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  {/* eslint-disable-next-line */}
                  <img
                    src={DEFAULT_PLACEHOLDER}
                    alt="No image available"
                    className="w-1/2 h-1/2 object-contain opacity-50"
                  />
                </div>
              )}
            </div>

            <div
              className="absolute inset-0 flex flex-col items-center justify-between h-full p-6 text-center z-10"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
            >
              <div
                className={`absolute top-0 left-0 w-16 h-16 flex items-start justify-start p-4 ${!isMobile ? 'hover-trigger' : ''}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all shadow-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  onClick={() => toggleInfo(index)}
                >
                  <FontAwesomeIcon icon={faCircleInfo} className="text-white text-sm" />
                </button>
              </div>

              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute flex items-center justify-center w-16 h-16 rounded-full transition-all hover:bg-blue-600"
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <FontAwesomeIcon icon={faPlay} className="text-white text-2xl" />
                </a>
              )}

              <h3 className="text-3xl font-semibold mb-1 text-white">{project.title}</h3>
              <p className="text-lg mb-4 text-white">{project.footerText}</p>

              {showInfoIndex === index && (
                <div
                  className="absolute inset-0 z-20 flex flex-col p-8 overflow-y-auto"
                  style={{ backgroundColor: 'rgba(245, 245, 247, 0.95)' }}
                  onMouseEnter={() => !isMobile && setShowInfoIndex(index)}
                  onMouseLeave={() => !isMobile && setShowInfoIndex(null)}
                >
                  {isMobile && (
                    <button
                      className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-all"
                      onClick={() => toggleInfo(index)}
                    >
                      <FontAwesomeIcon icon={faCircleXmark} className="text-gray-700" />
                    </button>
                  )}

                  <div className="mt-8">
                    <h3 className="text-3xl font-semibold mb-4 text-gray-900">{project.title}</h3>

                    <div className="mb-6">
                      <h4 className="text-xl font-medium mb-2 text-gray-800">Description</h4>
                      <p className="text-lg text-gray-700">{project.description}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-xl font-medium mb-2 text-gray-800">Technologies</h4>
                      <ul className="flex flex-wrap gap-2">
                        {project.technologiesUsed && project.technologiesUsed.length > 0 ? (
                          project.technologiesUsed.split(',').map((tech, i) => (
                            <li key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {tech}
                            </li>
                          ))
                        ) : (
                          <li className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            React.js
                          </li>
                        )}
                      </ul>
                    </div>

                    {project.techStack && (
                      <div className="mb-6">
                        <h4 className="text-xl font-medium mb-2 text-gray-800">Stack</h4>
                        <ul className="flex flex-wrap gap-2">
                          {project.techStack.split(',').map((item, i) => (
                            <li key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {item.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGrid;