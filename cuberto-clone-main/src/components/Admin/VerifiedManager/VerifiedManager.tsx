'use client';

import { useState } from 'react';

import AboutSection from './AboutSection';
import AcademicResult from './AcademicResult';
import ProfilePhoto from './ProfilePhoto';
import Resume from './Resume';
import Tagline from './Tagline';

export default function VerifiedManager() {
  const [activeSection, setActiveSection] = useState<'about' | 'tagline' | 'photo' | 'resume' | 'results'>('about');
  // eslint-disable-next-line
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const formatSyncTime = () => (lastSyncTime ? lastSyncTime.toLocaleString() : 'Never');

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Verified Section Manager</h2>

      {lastSyncTime && (
        <div className="mb-4 text-sm text-gray-500">
          <span>Last synced: {formatSyncTime()}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'about', label: 'About Text' },
          { key: 'tagline', label: 'Tagline' },
          { key: 'photo', label: 'Profile Photo' },
          { key: 'resume', label: 'Resume' },
          { key: 'results', label: 'Academic Results' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSection(tab.key as typeof activeSection)}
            aria-label={`${tab.label} Section`}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition ${activeSection === tab.key
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        {activeSection === 'about' && <AboutSection />}
        {activeSection === 'tagline' && <Tagline />}
        {activeSection === 'photo' && (
          <ProfilePhoto
            onPhotoUpdate={(newUrl) => {
              console.log('Photo updated to:', newUrl); // optional
            }}
          />
        )}
        {activeSection === 'resume' && <Resume />}
        {activeSection === 'results' && <AcademicResult />}
      </div>
    </div>
  );
}
