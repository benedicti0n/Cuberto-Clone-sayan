"use client";

import { useRef, useState, useEffect } from "react";
import Cursor from "@/components/Cursors/Cursor";
import Landingpage from "@/components/LandingPage/Landingpage";
import NavHeader from "@/components/NavHeader";
import Socials from "@/components/LandingPage/Socials";
import SideNav from "@/components/SideNav";
import MovieSwiper from "@/components/MovieSwiper/MovieSwiper";
import PhotoGrid from "@/components/PhotoGrid/PhotoGrid";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import VideoHeader from '@/components/VideoHeader/VideoHeader';
import ScrollAnimation from '@/components/ScrollAnimation/ScrollAnimation';
import axios from "axios";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

interface AcademicResult {
  _id: string;
  title: string;
  imageUrl?: string;
  contentType?: string;
  fileBuffer?: string;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const stickyElement = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line
  const [isMobile, setIsMobile] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const [tagline, setTagline] = useState<{ tagline: string }>({ tagline: "" });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [results, setResults] = useState<AcademicResult[]>([]);

  const [cursorState] = useState({
    isHoveringOnVideo: false,
    isVideoPlaying: false
  })
  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchTagline = async () => {
    try {
      const res = await axios.get(`${serverUrl}/verifiedManager/fetchTagline`);
      setTagline({ tagline: res.data.tagline || "" });
    } catch (err) {
      console.error("Error fetching tagline:", err);
    }
  };

  const fetchPhoto = async () => {
    try {
      const response = await axios.get(`${serverUrl}/profilePhoto/get`, {
        responseType: 'blob',
      });

      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setPhotoUrl(imageUrl);
    } catch (err) {
      console.error('Failed to fetch profile photo:', err);
      setPhotoUrl("");
    }
  };

  const fetchResume = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/resume/getResume`, {
        responseType: 'blob',
      });
      if (data) {
        const url = URL.createObjectURL(data);
        setResumeUrl(url);
      }
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      setResumeUrl(null);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${serverUrl}/academic/getAll`) // You'll need this backend route
      setResults(res.data)
    } catch (err) {
      console.error('Failed to fetch results', err)
    }
  }

  useEffect(() => {
    fetchTagline()
    fetchPhoto()
    fetchResume()
    fetchResults()
  }, [])

  const getFileNameFromUrl = (url: string | null | undefined): string => {
    if (!url) return 'Profile_Photo.jpg';
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return fileName || 'Profile_Photo.jpg';
  };

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>, filePath: string | null | undefined) => {
    if (!filePath) return false;
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: any }).MSStream) {
      e.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = filePath;
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
      return false;
    }
    return true;
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <NavHeader ref={stickyElement} onClick={() => setIsOpen((prev) => !prev)} />
      <SideNav isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="relative">
        <ScrollAnimation>
          <Landingpage />
        </ScrollAnimation>
        <div className="circular-video-container">
          <VideoHeader videoSrc="/assets/2.mp4" />
        </div>
      </div>

      <div className="relative py-6" id="projects">
        <ScrollAnimation direction="fade" delay={0.2}>
          <PhotoGrid />
        </ScrollAnimation>
      </div>

      <div className="relative mb-0">
        <ScrollAnimation direction="up" delay={0.3}>
          <MovieSwiper />
        </ScrollAnimation>
      </div>

      <div className="relative bg-gray-100 py-12" id="verified">
        <div className="container mx-auto px-4 md:px-[calc(var(--spacing)*40)]">
          <ScrollAnimation direction="fade">
            <div className="text-xs text-gray-500 space-y-4">
              <p className="font-medium">{tagline.tagline}</p>
              {tagline ? (
                <div dangerouslySetInnerHTML={{ __html: tagline.tagline }} />
              ) : null}
            </div>
          </ScrollAnimation>

          <div className="mt-8 pt-8 border-t border-gray-300"></div>

          {/* Mobile Footer (Accordion) - Hidden on md and up */}
          <div className="mt-8 space-y-0 md:hidden">
            <div className="border-b border-gray-200">
              <h3
                className="font-semibold text-gray-900 flex justify-between items-center py-3 px-2 cursor-pointer"
                onClick={() => toggleAccordion('photo')}
              >
                My Photo
                <span>
                  {activeAccordion === 'photo' ? '−' : '+'}
                </span>
              </h3>
              <ul className={`space-y-2 py-2 px-2 bg-gray-50 ${activeAccordion === 'photo' ? 'block' : 'hidden'}`}>
                {photoUrl && (
                  <li className="pb-2 flex items-center">
                    <a
                      href={photoUrl}
                      download={getFileNameFromUrl(photoUrl)}
                      onClick={(e) => handleDownload(e, photoUrl)}
                      className="text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      Profile Photo
                      <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div className="border-t border-gray-200">
              <h3
                className="font-semibold text-gray-900 flex justify-between items-center py-3 px-2 cursor-pointer"
                onClick={() => toggleAccordion('results')}
              >
                Academic Results
                <span>
                  {activeAccordion === 'results' ? '−' : '+'}
                </span>
              </h3>
              <ul className={`space-y-2 py-2 px-2 bg-gray-50 ${activeAccordion === 'results' ? 'block' : 'hidden'}`}>
                {results.map(result => (
                  result.imageUrl ? (
                    <li key={result._id} className="pb-2 flex items-center">
                      <a
                        href={result.imageUrl}
                        download={getFileNameFromUrl(result.imageUrl)}
                        onClick={(e) => handleDownload(e, result.imageUrl)}
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                      >
                        {result.title}
                        <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                      </a>
                    </li>
                  ) : null
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200">
              <h3
                className="font-semibold text-gray-900 flex justify-between items-center py-3 px-2 cursor-pointer"
                onClick={() => toggleAccordion('faq')}
              >
                FAQ
                <span>
                  {activeAccordion === 'faq' ? '−' : '+'}
                </span>
              </h3>
              <ul className={`space-y-2 py-2 px-2 bg-gray-50 ${activeAccordion === 'faq' ? 'block' : 'hidden'}`}>
                {resumeUrl && (
                  <li className="pb-2 flex items-center">
                    <a
                      href={resumeUrl}
                      download={getFileNameFromUrl(resumeUrl)}
                      onClick={(e) => handleDownload(e, resumeUrl)}
                      className="text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      Resume
                      <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 hidden md:grid md:grid-cols-3 md:gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">My Photo</h3>
              {photoUrl && (
                <a
                  href={photoUrl}
                  download={getFileNameFromUrl(photoUrl)}
                  onClick={(e) => handleDownload(e, photoUrl)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  Profile Photo
                  <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                </a>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Academic Results</h3>
              <ul className="space-y-2">
                {results.map(result => (
                  <li key={result._id}>
                    {result.contentType?.startsWith('image/') ? (
                      <a
                        href={result.imageUrl}
                        download={getFileNameFromUrl(result.imageUrl)}
                        onClick={(e) => handleDownload(e, result.imageUrl)}
                        className="text-gray-600 hover:text-gray-900 flex items-center"
                      >
                        {result.title}
                        <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                      </a>
                    ) : (
                      <a
                        href={`data:${result.contentType};base64,${result.fileBuffer}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {result.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">FAQ</h3>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  download={getFileNameFromUrl(resumeUrl)}
                  onClick={(e) => handleDownload(e, resumeUrl)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  Resume
                  <FontAwesomeIcon icon={faDownload} className="ml-2 text-sm" />
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-300 text-sm text-gray-600">
            <p>Contact me at: <a href="mailto:sayanbanik459@gmail.com" className="text-blue-600">sayanbanik459@gmail.com</a> or connect with me on <a href="#" className="text-blue-600">LinkedIn</a>.</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Socials />
      </div>

      <Cursor
        stickyElement={stickyElement}
        isHoveringOnVideo={cursorState.isHoveringOnVideo}
        isVideoPlaying={cursorState.isVideoPlaying}
      />
    </div>
  );
}