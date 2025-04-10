'use client';
import styles from '../../app/admin/admin.module.css';

export default function ExpertiseManager() {

  return (
    <div>
      <h2 className={styles.sectionTitle}>Expertise Manager</h2>

      {!isAdding && !editingId && (
        <button onClick={handleAddNew} className={styles.actionButton}>
          Add New Skill
        </button>
      )}

      {(isAdding || editingId) && (
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Skill Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="icon">Font Awesome Icon Code:</label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              required
            />
            <small>{`Enter the Font Awesome icon code (e.g., 'fa-code', 'fa-palette')`}</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="iconColor">Icon Color:</label>
            <div className={styles.colorPickerContainer}>
              <input
                type="color"
                id="iconColor"
                name="iconColor"
                value={formData.iconColor}
                onChange={handleInputChange}
              />
              <input
                type="text"
                value={formData.iconColor}
                onChange={handleInputChange}
                name="iconColor"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="backgroundImage">Background Image:</label>
            <div className={styles.imageUploadContainer}>
              <input
                type="text"
                id="backgroundImage"
                name="backgroundImage"
                value={formData.backgroundImage}
                onChange={handleInputChange}
                placeholder="Enter image URL or upload an image"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className={styles.uploadButton}
                disabled={uploadingImage}
              >
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            {uploadingImage && (
              <div className={styles.progressContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <span>{uploadProgress}%</span>
              </div>
            )}
            {formData.backgroundImage && (
              <div className={styles.imagePreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.backgroundImage}
                  alt="Background preview"
                  style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '10px' }}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="proficiencyLevel">{`Proficiency Level (%):`}</label>
            <input
              type="number"
              id="proficiencyLevel"
              name="proficiencyLevel"
              value={formData.proficiencyLevel}
              onChange={handleInputChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="learnMoreLink">Learn More Link:</label>
            <input
              type="text"
              id="learnMoreLink"
              name="learnMoreLink"
              value={formData.learnMoreLink}
              onChange={handleInputChange}
              placeholder="https://example.com"
            />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.saveButton}>
              {editingId ? 'Update Skill' : 'Add Skill'}
            </button>
            <button type="button" onClick={handleCancel} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className={styles.itemsList}>
        <h3>Current Skills</h3>
        {skills.length === 0 ? (
          <p>No skills added yet.</p>
        ) : (
          <div className={styles.responsiveGrid}>
            {skills.map(skill => (
              <div key={skill.id} className={styles.responsiveItemCard}>
                <h4 className={styles.skillTitle}>{skill.title}</h4>
                <p className={styles.skillDescription}>{skill.description}</p>

                <div className={styles.skillDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Icon:</span>
                    <span className={styles.detailValue}>{skill.icon}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Color:</span>
                    <span className={styles.detailValue}>
                      <span style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        backgroundColor: skill.iconColor,
                        marginRight: '5px',
                        borderRadius: '2px'
                      }}></span>
                      {skill.iconColor}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Proficiency:</span>
                    <span className={styles.detailValue}>{skill.proficiencyLevel}%</span>
                  </div>
                </div>

                {skill.backgroundImage && (
                  <div className={styles.responsiveImageContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={skill.backgroundImage}
                      alt={`${skill.title} background`}
                      className={styles.responsiveImage}
                    />
                  </div>
                )}

                <div className={styles.responsiveItemActions}>
                  <button
                    onClick={() => handleEdit(skill)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}