'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../app/admin/admin.module.css';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

export default function HeaderLineEditor() {
  const [headerLines, setHeaderLines] = useState<string[]>(['', '', '', '']);
  const [editedLines, setEditedLines] = useState<string[]>(['', '', '', '']);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: 'success' | 'error' }>({ text: '', type: 'success' });
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchHeaderLines = async () => {
      try {
        const res = await axios.get(`${serverUrl}/headerLine/getHeaderLine`);
        const lines = res.data?.headerLines || ['', '', '', ''];
        setHeaderLines(lines);
        setEditedLines(lines);
        setLastSyncTime(new Date());
      } catch (error) {
        console.error(error.stack);
        setSaveMessage({ text: 'Failed to fetch header lines.', type: 'error' });
      }
    };

    fetchHeaderLines();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedLines([...headerLines]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedLines([...headerLines]);
    setSaveMessage({ text: '', type: 'success' });
  };

  const handleLineChange = (index: number, value: string) => {
    const updated = [...editedLines];
    updated[index] = value;
    setEditedLines(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${serverUrl}/headerLine/editHeaderLine`, {
        headerLines: editedLines,
      });

      setHeaderLines([...editedLines]);
      setIsEditing(false);
      setSaveMessage({ text: 'Header lines saved successfully!', type: 'success' });
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error saving header lines:', error);
      setSaveMessage({ text: 'Failed to save header lines.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatSyncTime = () =>
    lastSyncTime ? lastSyncTime.toLocaleString() : 'Never';

  return (
    <div className={styles.adminSection}>
      <div className={styles.adminContentHeader}>
        <h2 className={styles.sectionTitle}>Header Line Editor</h2>

        {lastSyncTime && (
          <div className={styles.syncStatus}>
            <span>Last synced: {formatSyncTime()}</span>
          </div>
        )}
      </div>

      {saveMessage.text && (
        <div className={`${styles.messageBox} ${styles[saveMessage.type]}`}>
          {saveMessage.text}
        </div>
      )}

      {!isEditing ? (
        <div className={styles.itemCard}>
          <p><strong>Current Header Lines:</strong></p>
          <div className={styles.headerLinesPreview}>
            {headerLines.map((line, index) => (
              <p key={index} className={styles.headerLine}>
                {line || <em>Empty line</em>}
              </p>
            ))}
          </div>
          <button onClick={handleEdit} className={styles.actionButton}>
            Edit Header Lines
          </button>
        </div>
      ) : (
        <div className={styles.adminForm}>
          <div className={styles.formGroup}>
            <p className={styles.adminFormNote}>
              Edit the header lines that appear on the homepage. Keep each line concise for the best appearance.
            </p>

            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className={styles.headerLineInput}>
                <label htmlFor={`headerLine${index + 1}`}>Line {index + 1}:</label>
                <input
                  type="text"
                  id={`headerLine${index + 1}`}
                  value={editedLines[index] || ''}
                  onChange={(e) => handleLineChange(index, e.target.value)}
                  placeholder={`Enter line ${index + 1}`}
                  className={isSaving ? styles.disabledInput : ''}
                  disabled={isSaving}
                  maxLength={30}
                />
              </div>
            ))}

            <div className={styles.charLimitNote}>
              <small>Recommended: Keep each line under 30 characters for optimal display on all devices.</small>
            </div>

            <div className={styles.formActions}>
              <button
                onClick={handleSave}
                className={styles.actionButton}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className={`${styles.actionButton} ${styles.cancelButton}`}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}