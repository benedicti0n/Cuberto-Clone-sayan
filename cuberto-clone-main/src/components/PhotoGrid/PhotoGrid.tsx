'use client';

import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCircleInfo, faCircleXmark, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useSkeletonLoader } from '@/lib/hooks';
import { GridSkeleton } from '@/components/SkeletonLoaders';

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
  setActiveButtonIndex?: (index: number | null) => void;
}

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

const PhotoGrid = forwardRef<{ viewProjectRefs: React.MutableRefObject<(HTMLDivElement | null)[]> }, PhotoGridProps>(
  ({ setActiveButtonIndex }, ref) => {
  const [projects, setProjects] = useState<Project[]>([]);
  // eslint-disable-next-line
  const [showSection, setShowSection] = useState(true);
  const [showInfoIndex, setShowInfoIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  //eslint-disable-next-line
  const [isClient, setIsClient] = useState(false);
  
  // Create an array of refs for each project's View Project button
  const viewProjectRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Expose viewProjectRefs to parent component
  React.useImperativeHandle(ref, () => ({
    viewProjectRefs
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update refs array when projects change
  useEffect(() => {
    // Initialize or resize the refs array to match the projects length
    viewProjectRefs.current = viewProjectRefs.current.slice(0, projects.length);
    while (viewProjectRefs.current.length < projects.length) {
      viewProjectRefs.current.push(null);
    }
  }, [projects]);

  // Handle mouse enter/leave for the view project buttons
  const handleViewProjectMouseEnter = (index: number) => {
    if (!isMobile && setActiveButtonIndex) {
      setActiveButtonIndex(index);
    }
  };

  const handleViewProjectMouseLeave = () => {
    if (!isMobile && setActiveButtonIndex) {
      setActiveButtonIndex(null);
    }
  };

  // Replace the actual fetch function
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${serverUrl}/project/getAll`);
      const data = await res.json();
      setProjects(data);
      return data;
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      return [];
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

  // Function to get the appropriate image URL
  const getImageUrl = (project: Project) => {
    // If it's a URL
    if (project.imageUrl?.startsWith("http")) {
      return project.imageUrl;
    }

    // Fallback to server endpoint
    return `${serverUrl}/project/image/${project._id}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e.currentTarget.src);
    e.currentTarget.src = DEFAULT_PLACEHOLDER;
  };

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
              {(project.imageUrl) ? (
                // eslint-disable-next-line
                <img
                  src={getImageUrl(project)}
                  alt={project.title}
                  className="w-full h-full object-contain transition-all duration-500"
                  loading="lazy"
                  onError={handleImageError}
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
                <div
                  ref={el => {
                    viewProjectRefs.current[index] = el;
                    return undefined;
                  }}
                  className="absolute top-0 right-0 w-16 h-16 flex items-start justify-end p-4 cursor-pointer"
                  onMouseEnter={() => handleViewProjectMouseEnter(index)}
                  onMouseLeave={handleViewProjectMouseLeave}
                >
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-full transition-all shadow-sm"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white">
                      <FontAwesomeIcon 
                        icon={faArrowRight} 
                        className="text-blue-600 text-xs" 
                        style={{ transform: 'rotate(-45deg)' }}
                      />
                    </div>
                  </a>
                </div>
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
});

PhotoGrid.displayName = 'PhotoGrid';
export default PhotoGrid;