import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import api from '../api/axios';
import toast from 'react-hot-toast';
import FileUploadArea from '../components/pages/test';

function Dashboard() {
  const [besties, setBesties] = useState([]);
  const [selectedBestie, setSelectedBestie] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [bestiesLoading,setBestiesLoading] =useState(true);
  const [profilePicKey, setProfilePicKey] = useState(0);


  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    songDedication: false,
    messages: false,
    photoGallery: false,
    playlist: false,
    jokes: false,
    questions: false,
    reasons: false
  });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profilePic: ''
  });

  const [bestieContent, setBestieContent] = useState({
    id: null,
    fullName: '',
    nickname: '',
    secretCode: '',
    isPublished: false,
    song: {
      type: 'link',
      url: '',
      preview: false
    },
    messages: {
      part1: '',
      part2: ''
    },
    photos: [],
    playlist: [],
    jokes: [],
    questions: [],
    reasons: []
  });
  const [profile, setProfile] = useState(null);

  // Load admin profile and besties on mount
  useEffect(() => {
    fetchAdminProfile();
    fetchBesties();
  }, []);

  // Load bestie content when selected bestie changes
  useEffect(() => {
    if (selectedBestie && selectedBestie._id) {
      fetchBestieDetails(selectedBestie._id);
      setShowEditor(true);
    } else if (selectedBestie && selectedBestie.id === 'new') {
      // Reset content for new bestie
      setBestieContent({
        id: null,
        fullName: '',
        nickname: '',
        secretCode: `BS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        isPublished: false,
        song: { type: 'link', url: '', preview: false },
        messages: { part1: '', part2: '' },
        photos: [],
        playlist: [],
        jokes: [],
        questions: [],
        reasons: []
      });
      setShowEditor(true);
      setExpandedSections({
        basicInfo: true,
        songDedication: false,
        messages: false,
        photoGallery: false,
        playlist: false,
        jokes: false,
        questions: false,
        reasons: false
      });
    }
  }, [selectedBestie]);

  const fetchAdminProfile = async () => {
  try {
    setProfileLoading(true);
    
    // Fetch current admin profile
    const response = await api.get('/admin/profile');
    // console.log(response.data.data)
    if (response.data.success) {
      const adminData = response.data.data;
      
      // Update profile state
      setProfileData({
        profilePic: adminData.profilePhoto || "https://res.cloudinary.com/dxritu7i3/image/upload/v1753698926/80c78e06-2118-44c6-8821-55a8f65e3f41_awrjvy.png",
        name: adminData.name,
        email: adminData.email
      });
      
      // Store admin ID if needed
      localStorage.setItem('adminId', adminData.id);
       localStorage.setItem('adminData', JSON.stringify(adminData));
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('Error loading profile:', error);
    toast.error('Failed to load profile data');
  } finally {
    setProfileLoading(false);
  }
};

// In Dashboard.jsx - Update the fetchBesties function
const fetchBesties = async () => {
  try {
    setBestiesLoading(true);
    const response = await api.get('/besties');
    // console.log('Besties response:', response.data);
    
    if (response.data.success) {
      // Access the besties array from response.data.besties
      const bestiesData = response.data.besties || [];
      setBesties(bestiesData);
      
      if (bestiesData.length > 0 && !selectedBestie) {
        setSelectedBestie(bestiesData[0]);
      }
      
      toast.success(`Loaded ${bestiesData.length} besties`);
    } else {
      toast.error(response.data.message || 'Failed to load besties');
      setBesties([]); // Set empty array on error
    }
  } catch (error) {
    console.error('Error fetching besties:', error);
    toast.error(error.response?.data?.message || 'Failed to load besties');
    setBesties([]); // Set empty array on error
  } finally {
    setBestiesLoading(false);
  }
};

 const fetchBestieDetails = async (bestieId) => {
  try {
    setLoading(true);
    const response = await api.get(`/besties/${bestieId}`);
    // console.log('Bestie details response:', response.data);
    
    if (response.data.success) {
      const bestie = response.data.bestie;
      if (bestie) {
        setBestieContent({
          id: bestie._id,
          fullName: bestie.name || '',
          nickname: bestie.nickname || '',
          secretCode: bestie.secretCode || '',
          isPublished: bestie.isPublished || false,
          song: {
            type: bestie.songDedication ? 'link' : 'link',
            url: bestie.songDedication || '',
            preview: false
          },
          messages: {
            part1: bestie.messages?.[0] || '',
            part2: bestie.messages?.[1] || ''
          },
          photos: bestie.galleryImages?.map(img => img.url) || [],
          playlist: bestie.playlist?.map(song => ({
            id: song._id || Date.now(),
            title: song.title || '',
            artist: song.artist || '',
            link: song.link || '',
            audioUrl: song.audioUrl || ''
          })) || [],
          jokes: bestie.jokes || [],
          questions: bestie.questions?.map(q => ({
            id: q._id || Date.now(),
            question: q.question || '',
            answer: q.answer || ''
          })) || [],
          reasons: bestie.reasons || [],
          isPublished: bestie.isPublished || false
        });
      }
    } else {
      toast.error(response.data.message || 'Failed to load bestie details');
    }
  } catch (error) {
    console.error('Error fetching bestie details:', error);
    toast.error(error.response?.data?.message || 'Failed to load bestie details');
  } finally {
    setLoading(false);
  }
};
 const createBestie = async () => {
  try {
    setLoading(true);
    const newBestieData = {
      name: bestieContent.fullName || 'New Bestie',
      nickname: bestieContent.nickname || `Bestie${besties.length + 1}`,
    };
    
    const response = await api.post('/besties', newBestieData);
    console.log('Create bestie response:', response.data);
    
    if (response.data.success) {
      const newBestie = response.data.bestie;
      toast.success('Bestie created successfully!');
      
      // Refresh besties list
      await fetchBesties();
      
      // Select the newly created bestie
      setSelectedBestie(newBestie);
      setShowEditor(true);
    } else {
      toast.error(response.data.message || 'Failed to create bestie');
    }
  } catch (error) {
    console.error('Error creating bestie:', error);
    toast.error(error.response?.data?.message || 'Failed to create bestie');
  } finally {
    setLoading(false);
  }
};

 const updateBestie = async () => {
  if (!bestieContent.id) {
    await createBestie();
    return;
  }
  
  try {
    setLoading(true);
    const updates = {
      name: bestieContent.fullName,
      nickname: bestieContent.nickname,
      songDedication: bestieContent.song.url,
      messages: [bestieContent.messages.part1, bestieContent.messages.part2],
      galleryImages: bestieContent.photos.map(photo => ({ url: photo })),
      playlist: bestieContent.playlist.map(song => ({
        title: song.title,
        artist: song.artist,
        link: song.link,
        audioUrl: song.audioUrl
      })),
      jokes: bestieContent.jokes,
      questions: bestieContent.questions,
      reasons: bestieContent.reasons
    };
    
    const response = await api.put(`/besties/${bestieContent.id}`, updates);
    console.log('Update response:', response.data);
    
    if (response.data.success) {
      toast.success('Bestie updated successfully!');
      await fetchBesties();
    } else {
      toast.error(response.data.message || 'Failed to update bestie');
    }
  } catch (error) {
    console.error('Error updating bestie:', error);
    toast.error(error.response?.data?.message || 'Failed to update bestie');
  } finally {
    setLoading(false);
  }
};

const publishBestie = async () => {
  if (bestieContent.isPublished===true) {
    setBestieContent(prev => ({...prev, isPublished : false}))
  }
  if (!bestieContent.id) {
    await createBestie();
    return;
  }
  
  try {
    setLoading(true);
    const response = await api.post(`/besties/${bestieContent.id}/publish`);
    console.log('Publish response:', response.data);
    
    if (response.data.success) {
      setPublishSuccess(true);
    setBestieContent(prev => ({ ...prev, isPublished : true }));
      toast.success('Bestie published successfully!');
      await fetchBesties();
      
      setTimeout(() => {
        setPublishSuccess(false);
      }, 3000);
    } else {
      toast.error(response.data.message || 'Failed to publish bestie');
    }
  } catch (error) {
    console.error('Error publishing bestie:', error);
    toast.error(error.response?.data?.message || 'Failed to publish bestie');
  } finally {
    setLoading(false);
  }
};

  const deleteBestie = async () => {
    if (!selectedBestie?._id) return;
    
    try {
      setLoading(true);
      const response = await api.delete(`/besties/${selectedBestie._id}`);
      if (response.data.success) {
        toast.success('Bestie deleted successfully');
        await fetchBesties();
        setSelectedBestie(null);
        setShowEditor(false);
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting bestie:', error);
      toast.error(error.response?.data?.message || 'Failed to delete bestie');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async (index) => {
    const newPhotos = bestieContent.photos.filter((_, i) => i !== index);
    setBestieContent(prev => ({ ...prev, photos: newPhotos }));
    
    if (bestieContent.id) {
      try {
        await api.put(`/besties/${bestieContent.id}`, {
          galleryImages: newPhotos
        });
        toast.success('Image removed successfully');
      } catch (error) {
        console.error('Error removing image:', error);
        toast.error('Failed to remove image');
      }
    }
  };

  const handleAddPlaylistItem = () => {
    const newPlaylist = [...bestieContent.playlist, { id: Date.now(), title: '', artist: '', link: '' }];
    setBestieContent(prev => ({ ...prev, playlist: newPlaylist }));
  };

  const handleUpdatePlaylistItem = (id, field, value) => {
    const newPlaylist = bestieContent.playlist.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setBestieContent(prev => ({ ...prev, playlist: newPlaylist }));
  };

  const handleRemovePlaylistItem = (id) => {
    const newPlaylist = bestieContent.playlist.filter(item => item.id !== id);
    setBestieContent(prev => ({ ...prev, playlist: newPlaylist }));
  };

  const handleAddJoke = () => {
    if (bestieContent.jokes.length < 20) {
      setBestieContent(prev => ({ ...prev, jokes: [...prev.jokes, ''] }));
    }
  };

  const handleUpdateJoke = (index, value) => {
    const newJokes = [...bestieContent.jokes];
    newJokes[index] = value;
    setBestieContent(prev => ({ ...prev, jokes: newJokes }));
  };

  const handleRemoveJoke = (index) => {
    const newJokes = bestieContent.jokes.filter((_, i) => i !== index);
    setBestieContent(prev => ({ ...prev, jokes: newJokes }));
  };

  const handleAddQuestion = () => {
    if (bestieContent.questions.length < 10) {
      setBestieContent(prev => ({
        ...prev,
        questions: [...prev.questions, { id: Date.now(), question: '', answer: '' }]
      }));
    }
  };

  const handleUpdateQuestion = (id, value) => {
    const newQuestions = bestieContent.questions.map(q =>
      q.id === id ? { ...q, question: value } : q
    );
    setBestieContent(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleRemoveQuestion = (id) => {
    const newQuestions = bestieContent.questions.filter(q => q.id !== id);
    setBestieContent(prev => ({ ...prev, questions: newQuestions }));
  };

  const handleAddReason = () => {
    if (bestieContent.reasons.length < 10) {
      setBestieContent(prev => ({ ...prev, reasons: [...prev.reasons, ''] }));
    }
  };

  const handleUpdateReason = (index, value) => {
    const newReasons = [...bestieContent.reasons];
    newReasons[index] = value;
    setBestieContent(prev => ({ ...prev, reasons: newReasons }));
  };

  const handleRemoveReason = (index) => {
    const newReasons = bestieContent.reasons.filter((_, i) => i !== index);
    setBestieContent(prev => ({ ...prev, reasons: newReasons }));
  };

  const handleMoveReason = (index, direction) => {
    const newReasons = [...bestieContent.reasons];
    const [movedItem] = newReasons.splice(index, 1);
    newReasons.splice(index + direction, 0, movedItem);
    setBestieContent(prev => ({ ...prev, reasons: newReasons }));
  };



  const handleCreateBestie = () => {
    const newBestie = {
      id: 'new',
      name: 'New Bestie',
      nickname: '',
      secretCode: `BS-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      isPublished: false
    };
    setSelectedBestie(newBestie);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

const updateProfile = async () => {
  try {
    setLoading(true);
    
    // Get password values
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const newPassword = passwordInputs[0]?.value;
    const confirmPassword = passwordInputs[1]?.value;
    
    // Only update password if both fields are filled
    if (newPassword && confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }
      
      if (newPassword.length < 6) {
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      
      const currentPassword = prompt('Please enter your current password to confirm changes:');
      
      if (!currentPassword) {
        toast.error('Current password is required');
        setLoading(false);
        return;
      }
      
      // Call password update endpoint
      const response = await api.put('/admin/password', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        toast.success('Password updated successfully!');
        // Clear password fields
        passwordInputs.forEach(input => input.value = '');
      } else {
        throw new Error(response.data.message);
      }
    } else if (newPassword || confirmPassword) {
      toast.error('Please fill both password fields');
      setLoading(false);
      return;
    }
    
    // Close modal and show success
    setShowProfileModal(false);
    toast.success('Profile updated successfully!');

    fetchAdminProfile();

   
    
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.response?.status === 401) {
      toast.error('Current password is incorrect');
    } else if (error.response?.status === 400) {
      toast.error(error.response.data.message);
    } else {
      toast.error('Failed to update profile');
    }
  } finally {
    setLoading(false);
  }
};


/**
 * Close Profile Modal
 */
const handleCloseProfileModal = () => {
  setShowProfileModal(false);
};

/**
 * Copy to Clipboard
 */
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      toast.success('Copied to clipboard!');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy');
    });
};
    
  if (profileLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading BestieSpace...</p>
      </div>
    );
  }

const handleProfilePhotoUpload = async (uploadData) => {
  try {
    setProfileLoading(true);
    
    // If uploadData has file property (from FileUploadArea)
    if (uploadData.file) {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      
      // Assuming you have admin ID in localStorage or context
      const adminId = localStorage.getItem('adminId') || getAdminIdFromSomewhere();
      formData.append('adminId', adminId);
      
      // Upload to backend
      const response = await axios.post('/upload/admin/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        // Update local state with new profile photo from response
        setProfileData(prev => ({
          ...prev,
          profilePic: response.data.data.profilePhoto
          
        }));
        
        // Also update your main admin state if you have one
        if (setCurrentAdmin) {
          setCurrentAdmin(prev => ({
            ...prev,
            profilePhoto: response.data.data.profilePhoto
          }));
        }
        
        toast.success('Profile picture updated successfully!');
      } else {
        throw new Error(response.data.message);
      }
    } 
    // If uploadData already has URL (from your initial function)
    else if (uploadData.url) {
      // Update local state immediately for better UX
      setProfileData(prev => ({
        ...prev,
        profilePic: uploadData.url
      }));
      
      toast.success('Profile picture updated successfully!');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (error.response?.status === 400) {
      toast.error(error.response.data.message || 'Invalid file');
    } else if (error.response?.status === 404) {
      toast.error('Admin not found');
    } else if (error.response?.status === 413) {
      toast.error('File is too large');
    } else {
      toast.error('Failed to update profile picture');
    }
  } finally {
    setProfileLoading(false);
  }
};


const handleGalleryPhotoUpload = async (uploadData) => {
  try {
    const newPhoto = {
      url: uploadData.url,
      publicId: uploadData.publicId,
      name: uploadData.name,
      uploadedAt: new Date().toISOString()
    };
    
    // Update local state
    const newPhotos = [...bestieContent.photos, newPhoto];
    setBestieContent(prev => ({ ...prev, photos: newPhotos }));
    
    toast.success('Photo added to gallery!');
    
    // Refresh bestie data from server to ensure consistency
    if (bestieContent.id) {
      await fetchBestieDetails(bestieContent.id);
    }
  } catch (error) {
    console.error('Error updating gallery:', error);
    toast.error('Failed to add photo to gallery');
  }
};

// 3. Upload Dedicated Song (Video/Audio)
const handleDedicatedSongUpload = async (uploadData) => {
  try {
    // Update local state
    setBestieContent({
      ...bestieContent,
      song: {
        ...bestieContent.song,
        url: uploadData.url,
        type: 'upload',
        publicId: uploadData.publicId,
        fileType: uploadData.originalFile.type,
        duration: uploadData.duration
      }
    });
    
    toast.success('Song dedication uploaded successfully!');
    
    // Refresh bestie data
    if (bestieContent.id) {
      await fetchBestieDetails(bestieContent.id);
    }
  } catch (error) {
    console.error('Error updating song dedication:', error);
    toast.error('Failed to upload song');
  }
};

// 4. Upload Audio Playlist Items
const handleAudioPlaylistUpload = async (uploadData, songIndex = null) => {
  try {
    if (songIndex !== null) {
      // Update existing playlist item
      const updatedPlaylist = [...bestieContent.playlist];
      updatedPlaylist[songIndex] = {
        ...updatedPlaylist[songIndex],
        audioUrl: uploadData.url,
        publicId: uploadData.publicId,
        fileType: uploadData.originalFile.type,
        duration: uploadData.duration
      };
      
      setBestieContent(prev => ({ ...prev, playlist: updatedPlaylist }));
      toast.success('Audio file uploaded for playlist!');
    } else {
      // Add new playlist item with audio
      const newPlaylistItem = {
        id: Date.now(),
        title: '',
        artist: '',
        link: '',
        audioUrl: uploadData.url,
        publicId: uploadData.publicId,
        fileType: uploadData.originalFile.type,
        duration: uploadData.duration
      };
      
      const newPlaylist = [...bestieContent.playlist, newPlaylistItem];
      setBestieContent(prev => ({ ...prev, playlist: newPlaylist }));
      
      toast.success('Audio file added to playlist!');
    }
    
    // Refresh bestie data
    if (bestieContent.id) {
      await fetchBestieDetails(bestieContent.id);
    }
  } catch (error) {
    console.error('Error updating playlist:', error);
    toast.error('Failed to update playlist');
  }
};



  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <div className="admin-profile">
            <img 
              src={profileData.profilePic || 'https://res.cloudinary.com/dxritu7i3/image/upload/v1753698926/80c78e06-2118-44c6-8821-55a8f65e3f41_awrjvy.png'} 
              alt="Admin" 
              className="admin-avatar" 
            />
            <div className="admin-info">
              <h3>{profileData.name || 'Admin User'}</h3>
              <p className="admin-role">BestieSpace Admin</p>
            </div>
          </div>
        </div>
        <div className="top-bar-right">
          <button 
            className="profile-button"
            onClick={() => setShowProfileModal(true)}
          >
            <span className="profile-icon">👤</span>
            Profile Settings
          </button>
        </div>
      </header>

      <div className="dashboard-content">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <button 
          className="create-bestie-btn" 
          onClick={handleCreateBestie}
          disabled={loading}
        >
          <span className="plus-icon">+</span>
          {loading ? 'Creating...' : 'Create New Bestie'}
        </button>
        
        <div className="besties-section">
          <h3 className="besties-title">Your Besties</h3>
          <p className="besties-subtitle">Select a bestie to edit their content</p>
          
          <div className="besties-list">
            {bestiesLoading ? (
              <div className="loading-besties">
                <div className="mini-spinner"></div>
                <span>Loading besties...</span>
              </div>
            ) : Array.isArray(besties) && besties.length > 0 ? (
              besties.map(bestie => (
                <div 
                  key={bestie._id}
                  className={`bestie-item ${selectedBestie?._id === bestie._id ? 'active' : ''}`}
                  onClick={() => setSelectedBestie(bestie)}
                >
                  <div className="bestie-avatar">
                    {bestie.isPublished ? '🌟' : '📝'}
                  </div>
                  <div className="bestie-info">
                    <h4>{bestie.name || 'Unnamed Bestie'}</h4>
                    <p className="bestie-nickname">{bestie.nickname || 'No nickname'}</p>
                    <div className="bestie-meta">
                      <span className={`status ${bestie.isPublished ? 'published' : 'draft'}`}>
                        {bestie.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className="last-edited">
                        {new Date(bestie.updatedAt || bestie.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-besties">No besties yet. Create your first one!</p>
            )}
          </div>
        </div>
      </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {!showEditor ? (
            <div className="welcome-screen">
              <div className="welcome-content">
                <div className="welcome-icon">👋</div>
                <h2>Welcome to BestieSpace!</h2>
                <p className="welcome-text">
                  Select a bestie from the sidebar to edit their personalized content,<br />
                  or create a new bestie to start something special.
                </p>
                <div className="welcome-stats">
                  <div className="stat">
                    <span className="stat-number">{besties.length}</span>
                    <span className="stat-label">Besties</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">
                      {besties.filter(b => b.isPublished).length}
                    </span>
                    <span className="stat-label">Published</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">
                      {besties.filter(b => !b.isPublished).length}
                    </span>
                    <span className="stat-label">Drafts</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bestie-editor">
              <div className="editor-header">
                <div className="editor-title">
                  <h2>
                    {selectedBestie?.id === 'new' ? 'Create New Bestie' : `Editing: ${selectedBestie?.name}`}
                  </h2>
                  {selectedBestie?.id !== 'new' && (
                    <div className="editor-status">
                      <span className={`status-badge ${bestieContent.isPublished ? 'published' : 'draft'}`}>
                        {bestieContent.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  )}
                </div>
                <button 
                  className="save-btn" 
                  onClick={updateBestie}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>

              {/* Basic Info Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('basicInfo')}>
                  <div className="section-title">
                    <span className="section-icon">👤</span>
                    <h3>Basic Bestie Info</h3>
                  </div>
                  <span className={`toggle-arrow ${expandedSections.basicInfo ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.basicInfo ? 'expanded' : ''}`}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Bestie Full Name *</label>
                      <input
                        type="text"
                        value={bestieContent.fullName}
                        onChange={(e) => setBestieContent({...bestieContent, fullName: e.target.value})}
                        placeholder="Enter bestie's full name"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Nickname (Unique)</label>
                      <input
                        type="text"
                        value={bestieContent.nickname}
                        onChange={(e) => setBestieContent({...bestieContent, nickname: e.target.value})}
                        placeholder="What do you call them?"
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Secret Access Code</label>
                      <div className="secret-code-display">
                        <input
                          type="text"
                          value={bestieContent.secretCode}
                          readOnly
                          className="read-only noCursor"
                        />
                        <button 
                          className="copy-btn small"
                          onClick={() => copyToClipboard(bestieContent.secretCode)}
                          disabled={loading}
                        >
                          Copy
                        </button>
                      </div>
                      <small className="hint" style={{padding:"2px"}}>Bestie will use this code to access their dashboard !  </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Song Dedication Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('songDedication')}>
                  <div className="section-title">
                    <span className="section-icon">🎵</span>
                    <h3>Song Dedication</h3>
                  </div>
                  <span className={`toggle-arrow ${expandedSections.songDedication ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.songDedication ? 'expanded' : ''}`}>
                  <div className="song-options">
                    <label className="option">
                      <input
                        type="radio"
                        name="songType"
                        checked={bestieContent.song.type === 'upload'}
                        onChange={() => setBestieContent({
                          ...bestieContent,
                          song: {...bestieContent.song, type: 'upload'}
                        })}
                        disabled={loading}
                      />
                      <span>Upload Video File</span>
                    </label>
                    <label className="option">
                      <input
                        type="radio"
                        name="songType"
                        checked={bestieContent.song.type === 'link'}
                        onChange={() => setBestieContent({
                          ...bestieContent,
                          song: {...bestieContent.song, type: 'link'}
                        })}
                        disabled={loading}
                      />
                      <span>Paste Song/Video Link</span>
                    </label>
                  </div>
                  
                  {/* // 3. Song Dedication - Video/Audio Upload */}
                  {bestieContent.song.type === 'upload' ? (
                    <div className="upload-section">
                      <FileUploadArea
                        onUpload={handleDedicatedSongUpload}
                        accept="video/*,audio/*"
                        maxSizeMB={100}
                        type="video"
                        endpoint="/upload/besties/song"
                        additionalData={{ bestieId: bestieContent.id }}
                        label="Upload Song Dedication"
                      />
                      {bestieContent.song.url && (
                        <div className="uploaded-media-preview">
                          <h4>Uploaded Media</h4>
                          {bestieContent.song.fileType?.startsWith('video/') ? (
                            <div className="video-player">
                              <video controls>
                                <source src={bestieContent.song.url} type={bestieContent.song.fileType} />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : bestieContent.song.fileType?.startsWith('audio/') ? (
                            <div className="audio-player">
                              <audio controls>
                                <source src={bestieContent.song.url} type={bestieContent.song.fileType} />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ) :(
                    <div className="link-input-section">
                      <input
                        type="text"
                        value={bestieContent.song.url}
                        onChange={(e) => setBestieContent({
                          ...bestieContent,
                          song: {...bestieContent.song, url: e.target.value}
                        })}
                        placeholder="Paste YouTube, Spotify, or Apple Music link"
                        disabled={loading}
                      />
                      {bestieContent.song.url && (
                        <button 
                          className="preview-btn"
                          onClick={() => setBestieContent({
                            ...bestieContent,
                            song: {...bestieContent.song, preview: true}
                          })}
                          disabled={loading}
                        >
                          Preview
                        </button>
                      )}
                    </div>
                  )}
                  
                  {bestieContent.song.preview && (
                    <div className="preview-section">
                      <h4>Preview</h4>
                      <div className="video-preview">
                        <div className="preview-placeholder">
                          <span className="play-icon">▶</span>
                          <p>Youtube Links won't work !</p>
                          <video style={{
                            maxWidth:'400px',
                            width:'50vw',
                            borderRadius:"10px"

                          }} controls autoPlay muted>
                            <source src= {bestieContent.song.url} />
                          </video>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('messages')}>
                  <div className="section-title">
                    <span className="section-icon">💌</span>
                    <h3>Personal Messages</h3>
                  </div>
                  <span className={`toggle-arrow ${expandedSections.messages ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.messages ? 'expanded' : ''}`}>
                  <p className="section-description">
                    These messages will appear as two separate paragraphs on your bestie's page
                  </p>
                  <div className="messages-grid">
                    <div className="form-group">
                      <label>Message Part One</label>
                      <textarea
                        value={bestieContent.messages.part1}
                        onChange={(e) => setBestieContent({
                          ...bestieContent,
                          messages: {...bestieContent.messages, part1: e.target.value}
                        })}
                        placeholder="Write your heartfelt message here..."
                        rows={4}
                        disabled={loading}
                      />
                    </div>
                    <div className="form-group">
                      <label>Message Part Two</label>
                      <textarea
                        value={bestieContent.messages.part2}
                        onChange={(e) => setBestieContent({
                          ...bestieContent,
                          messages: {...bestieContent.messages, part2: e.target.value}
                        })}
                        placeholder="Continue your message or add something new..."
                        rows={4}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo Gallery Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('photoGallery')}>
                  <div className="section-title">
                    <span className="section-icon">📸</span>
                    <h3>Photo Gallery</h3>
                    {bestieContent.photos.length > 0 && (
                      <span className="item-count">{bestieContent.photos.length} photos</span>
                    )}
                  </div>
                  <span className={`toggle-arrow ${expandedSections.photoGallery ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.photoGallery ? 'expanded' : ''}`}>
                  <div className="gallery-container">
                    <div className="gallery-grid">
                      {bestieContent.photos.map((photo, index) => (
                        <div key={index} className="gallery-item">
                          <img src={photo.url || photo} alt={`Memory ${index + 1}`} />
                          <button
                            className="remove-btn"
                            onClick={() => handleRemovePhoto(index)}
                            aria-label="Remove photo"
                            disabled={loading}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div className="gallery-item add-item">
                      
                        <FileUploadArea
                          onUpload={handleGalleryPhotoUpload}
                          accept="image/*"
                          maxSizeMB={5}
                          type="image"
                          endpoint="/upload/besties/gallery"
                          additionalData={{ bestieId: bestieContent.id }}
                          multiple={true}
                          label="Upload Photos"
                        />
                      </div>
                    </div>
                  </div>
                  <small className="hint">
                    Gallery expands automatically on the bestie page based on uploaded images
                  </small>
                </div>
              </div>

              {/* Playlist Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('playlist')}>
                  <div className="section-title">
                    <span className="section-icon">🎶</span>
                    <h3>Dedicated Music Playlist</h3>
                    {bestieContent.playlist.length > 0 && (
                      <span className="item-count">{bestieContent.playlist.length} songs</span>
                    )}
                  </div>
                  <span className={`toggle-arrow ${expandedSections.playlist ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.playlist ? 'expanded' : ''}`}>
                  <div className="playlist-controls">
                    <button 
                      className="add-btn" 
                      onClick={handleAddPlaylistItem}
                      disabled={loading}
                    >
                      + Add Song
                    </button>
                  </div>
                  
                  {/* // 4. Playlist Items - Audio Upload per song */}
                {bestieContent.playlist.map((song, index) => (
                      <div key={index} className="playlist-item">
                        <div className="song-fields">
                          <input
                            type="text"
                            placeholder="Song Title"
                            value={song.title || ''}
                            onChange={(e) => handleUpdatePlaylistItem(song.index, 'title', e.target.value)}
                            disabled={loading}
                          />
                          <input
                            type="text"
                            placeholder="Artist"
                            value={song.artist || ''}
                            onChange={(e) => handleUpdatePlaylistItem(song.index, 'artist', e.target.value)}
                            disabled={loading}
                          />
                          <div className="audio-upload-section">
                            {song.audioUrl ? (
                              <div className="audio-preview">
                                <audio controls>
                                  <source src={song.audioUrl} type={song.fileType} />
                                  Your browser does not support the audio element.
                                </audio>
                                <button
                                  className="remove-btn small"
                                  onClick={() => {
                                    const updatedPlaylist = [...bestieContent.playlist];
                                    updatedPlaylist[index] = { ...updatedPlaylist[index], audioUrl: null };
                                    setBestieContent(prev => ({ ...prev, playlist: updatedPlaylist }));
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <FileUploadArea
                                onUpload={(uploadData) => handleAudioPlaylistUpload(uploadData, index)}
                                  accept="audio/*"
                                  maxSizeMB={50}
                                  type="audio"
                                  endpoint="/upload/besties/playlist"
                                  additionalData={{ 
                                    bestieId: bestieContent.id,
                                    songIndex: index 
                                  }}
                                  label="Upload Audio File"
                              />
                            )}
                          </div>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemovePlaylistItem(song.id)}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                 </div>
                </div>

              {/* Jokes Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('jokes')}>
                  <div className="section-title">
                    <span className="section-icon">😂</span>
                    <h3>Inside Jokes</h3>
                    <span className="item-count">
                      {bestieContent.jokes.filter(j => j.trim()).length} / 20
                    </span>
                  </div>
                  <span className={`toggle-arrow ${expandedSections.jokes ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.jokes ? 'expanded' : ''}`}>
                  <div className="jokes-list">
                    {bestieContent.jokes.map((joke, index) => (
                      <div key={index} className="joke-item">
                        <input
                          type="text"
                          value={joke || ''}
                          onChange={(e) => handleUpdateJoke(index, e.target.value)}
                          placeholder={`Inside joke #${index + 1}`}
                          disabled={loading}
                        />
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveJoke(index)}
                          disabled={loading}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {bestieContent.jokes.length < 20 && (
                    <button 
                      className="add-btn" 
                      onClick={handleAddJoke}
                      disabled={loading}
                    >
                      + Add Joke
                    </button>
                  )}
                </div>
              </div>

              {/* Questions Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('questions')}>
                  <div className="section-title">
                    <span className="section-icon">❓</span>
                    <h3>Questions for Your Bestie</h3>
                    <span className="item-count">
                      {bestieContent.questions.filter(q => q?.question?.trim()).length} / 10
                    </span>
                  </div>
                  <span className={`toggle-arrow ${expandedSections.questions ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.questions ? 'expanded' : ''}`}>
                  <div className="questions-list">
                    {bestieContent.questions.map((q) => (
                      <div key={Math.floor(Math.random()*1000)} className="question-item">
                        <input
                          type="text"
                          value={q.question || ''}
                          onChange={(e) => handleUpdateQuestion(q.id, e.target.value)}
                          placeholder="Ask something meaningful..."
                          disabled={loading}
                        />
                        <div className="answer-preview">
                          <label>Bestie's response will appear here after they answer:</label>
                          <div className="answer-placeholder">
                            <span className="answer-icon">💭</span>
                            <p>{q.answer || 'Waiting for bestie\'s answer...'}</p>
                          </div>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveQuestion(q.id)}
                          disabled={loading}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  {bestieContent.questions.length < 10 && (
                    <button 
                      className="add-btn" 
                      onClick={handleAddQuestion}
                      disabled={loading}
                    >
                      + Add Question
                    </button>
                  )}
                </div>
              </div>

              {/* Reasons Section */}
              <div className="section-card">
                <div className="section-header" onClick={() => toggleSection('reasons')}>
                  <div className="section-title">
                    <span className="section-icon">❤️</span>
                    <h3>Reasons Why I Love You</h3>
                    <span className="item-count">
                      {bestieContent.reasons.filter(r => r.trim()).length} / 10
                    </span>
                  </div>
                  <span className={`toggle-arrow ${expandedSections.reasons ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
                
                <div className={`section-content ${expandedSections.reasons ? 'expanded' : ''}`}>
                  <div className="reasons-list">
                    {bestieContent.reasons.map((reason, index) => (
                      <div key={index} className="reason-item">
                        <span className="reason-number">{index + 1}</span>
                        <input
                          type="text"
                          value={reason || ''}
                          onChange={(e) => handleUpdateReason(index, e.target.value)}
                          placeholder={`Reason #${index + 1} why I love you...`}
                          disabled={loading}
                        />
                        <div className="reason-controls">
                          <button
                            className="move-btn"
                            onClick={() => handleMoveReason(index, -1)}
                            disabled={index === 0 || loading}
                          >
                            ↑
                          </button>
                          <button
                            className="move-btn"
                            onClick={() => handleMoveReason(index, 1)}
                            disabled={index === bestieContent.reasons.length - 1 || loading}
                          >
                            ↓
                          </button>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveReason(index)}
                            disabled={loading}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {bestieContent.reasons.length < 10 && (
                    <button 
                      className="add-btn" 
                      onClick={handleAddReason}
                      disabled={loading}
                    >
                      + Add Reason
                    </button>
                  )}
                </div>
              </div>

              {/* Fixed Publish Controls */}
              <div className="publish-controls">
                <div className="publish-content">
                  <button 
                    className="publish-btn"
                    onClick={publishBestie}
                    disabled={!bestieContent.fullName.trim() || loading}
                  >
                    {loading ? 'Publishing...' : bestieContent.isPublished ? 'Update & Republish' : 'Publish Bestie Content'}
                  </button>
                  
                  {publishSuccess && (
                    <div className="success-message">
                      ✅ Published successfully! Your bestie can now access their page.
                    </div>
                  )}
                  
                  <div className="access-link-section">
                    <h4>Bestie Access Link</h4>
                    <div className="link-display">
                      <input
                        type="text"
                        value={
                          bestieContent.isPublished=== true ? "https://davidkori.github.io/bestie.com/" : ""
                          }
                        readOnly
                        className="access-link"
                        style={{
                          color:"black",
                          padding:"5px",
                          fontSize:"1rem"
                        }}
                      />
                      <div className="link-actions">
                        <button 
                          className="action-btn copy"
                          onClick={() => copyToClipboard(bestieContent.isPublished==="true" ? "https://davidkori.github.io/bestie.com/" : "")}
                          disabled={loading}
                        >
                          📋 Copy Link
                        </button>
                        <button 
                          className="action-btn share"
                          disabled={loading}
                        >
                          📤 Share
                        </button>
                      </div>
                    </div>
                    <small className="helper-text">
                      Share this link with your bestie. They will use their secret code to view their content.
                    </small>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="danger-zone">
                <h3>⚠️ Danger Zone</h3>
                <p>Deleting this bestie will permanently remove all their data including messages, photos, and memories.</p>
                <button 
                  className="delete-btn"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={selectedBestie?.id === 'new' || loading}
                >
                  Delete Bestie
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profile Modal
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Profile Settings</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowProfileModal(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <section className="modal-section">
                <h3>Admin Information</h3>
                <div className="profile-picture-section">
                  <img 
                    src={profileData.profilePic } 
                    alt="Profile" 
                    className="profile-preview" 
                  />
                    <FileUploadArea
                      onUpload={handleProfilePhotoUpload}
                      accept="image/*"
                      maxSizeMB={5}
                      type="image"
                      endpoint="/upload/admin/profile"
                      label="Upload New Profile Picture"
                    />

                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={profileData.name} 
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    disabled
                    style={{
                      cursor:"not-allowed",
                      color:"black"
                    }}

                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled
                    style={{
                      cursor:"not-allowed",
                      color:"black"

                    }}


                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password" 
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="Re-enter new password" 
                    disabled={loading}
                  />
                </div>
                <button 
                  className="save-changes-btn"
                  onClick={updateProfile}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </section>

              <section className="modal-section">
                <h3>Invite others to BestieSpace</h3>
                <div className="referral-section">
                  <p>Share your referral link with friends:</p>
                  <div className="referral-link-display">
                    <input
                      type="text"
                      value="https://davikori.github.io/bestiemaker.com"
                      readOnly
                      className="referral-input"
                    />
                    <button 
                      className="copy-btn"
                      onClick={() => copyToClipboard('hhttps://davikori.github.io/bestiemaker.com')}
                      disabled={loading}
                    >
                      Copy
                    </button>
                  </div>
                  <small className="referral-note">Referral rewards coming soon.</small>
                </div>
              </section>
            </div>
          </div>
        </div>
      )} */}

              {/* Profile Modal */}
        {showProfileModal && (
          <div className="modal-overlay" onClick={handleCloseProfileModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Profile Settings</h2>
                <button 
                  className="modal-close" 
                  onClick={handleCloseProfileModal}
                  disabled={loading || profileLoading}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <section className="modal-section">
                  <h3>Admin Information</h3>
                  <div className="profile-picture-section">
                    {/* Profile Image with Cache Busting */}
                    <img 
                      src={profileData.profilePic + (profileData.profilePic.includes('cloudinary.com') ? `?t=${Date.now()}` : '')} 
                      alt="Profile" 
                      className="profile-preview"
                      key={profileData.profilePic} // Force re-render when URL changes
                      onError={(e) => {
                        e.target.src = "https://res.cloudinary.com/dxritu7i3/image/upload/v1753698926/80c78e06-2118-44c6-8821-55a8f65e3f41_awrjvy.png";
                      }}
                    />
                    <FileUploadArea
                      onUpload={handleProfilePhotoUpload}
                      accept="image/*"
                      maxSizeMB={5}
                      type="image"
                      endpoint="/upload/admin/profile"
                      label={profileLoading ? "Uploading..." : "Upload New Profile Picture"}
                      disabled={profileLoading}
                    />
                    {profileLoading && (
                      <div className="upload-progress">
                        <div className="progress-bar"></div>
                        <span>Updating...</span>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name} 
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email} 
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter new password" 
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="Re-enter new password" 
                      disabled={loading}
                    />
                  </div>
                  <button 
                    className="save-changes-btn"
                    onClick={updateProfile}
                    disabled={loading || profileLoading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </section>

                <section className="modal-section">
                  <h3>Invite others to BestieSpace</h3>
                  <div className="referral-section">
                    <p>Share your referral link with friends:</p>
                    <div className="referral-link-display">
                      <input
                        type="text"
                        value="https://davikori.github.io/bestiemaker.com"
                        readOnly
                        className="referral-input"
                      />
                      <button 
                        className="copy-btn"
                        onClick={() => copyToClipboard('https://davikori.github.io/bestiemaker.com')}
                        disabled={loading || profileLoading}
                      >
                        Copy
                      </button>
                    </div>
                    <small className="referral-note">Referral rewards coming soon.</small>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Bestie</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">⚠️</div>
              <h3>Are you absolutely sure?</h3>
              <p className="warning-text">
                This action cannot be undone. This will permanently delete <strong>{selectedBestie?.name}</strong> and all associated content:
              </p>
              <ul className="warning-list">
                <li>All personalized messages and memories</li>
                <li>Photo gallery and videos</li>
                <li>Music playlist and songs</li>
                <li>Jokes, questions, and reasons</li>
                <li>The bestie's access link and secret code</li>
              </ul>
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn"
                  onClick={deleteBestie}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Yes, Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

