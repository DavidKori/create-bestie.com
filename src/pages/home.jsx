import React, { useState } from 'react';
import './home.css';

function Home() {
  const [besties, setBesties] = useState([
    { id: 1, name: 'Alex Johnson', nickname: 'Lexi', secretCode: 'BESTIE-LEXI-2024' },
    { id: 2, name: 'Taylor Smith', nickname: 'Tay', secretCode: 'BESTIE-TAY-2024' },
    { id: 3, name: 'Jordan Williams', nickname: 'Jordy', secretCode: 'BESTIE-JORDY-2024' }
  ]);
  
  const [selectedBestie, setSelectedBestie] = useState(besties[0]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'Jamie Admin',
    email: 'jamie@bestiespace.com',
    profilePic: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  });
  
  const [bestieContent, setBestieContent] = useState({
    fullName: 'Alex Johnson',
    nickname: 'Lexi',
    secretCode: 'BESTIE-LEXI-2024',
    song: {
      type: 'link',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      preview: true
    },
    messages: {
      part1: 'Remember that time we stayed up all night talking about our dreams?',
      part2: 'You were there for me when no one else was. Thank you for being my person.'
    },
    photos: [
      'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    ],
    playlist: [
      { id: 1, title: 'Our Summer Song', artist: 'The Sunshine Band', link: 'spotify:track:12345' },
      { id: 2, title: 'Midnight Memories', artist: 'Luna', link: 'youtube:video:abc123' },
      { id: 3, title: 'Forever Friends', artist: 'Harmony Duo', link: 'applemusic:track:xyz789' }
    ],
    jokes: [
      "Why don't we ever tell secrets on a farm? Because the potatoes have eyes and the corn has ears!",
      "Remember when you tried to teach me how to dance? We looked like two happy penguins!",
      "Our inside joke about the pineapple pizza debate will never get old!"
    ],
    questions: [
      { id: 1, question: "What's your favorite memory of us?", answer: "" },
      { id: 2, question: "If we could travel anywhere together, where would you want to go?", answer: "" },
      { id: 3, question: "What's something you've always wanted to tell me?", answer: "" }
    ],
    reasons: [
      "You always know how to make me laugh, even on my worst days",
      "Your support means more to me than you'll ever know",
      "You're the first person I want to share good news with",
      "Your kindness inspires me to be a better person",
      "We can sit in comfortable silence and it's never awkward"
    ]
  });

  const handleCreateBestie = () => {
    const newBestie = {
      id: besties.length + 1,
      name: 'New Bestie',
      nickname: 'Bestie' + (besties.length + 1),
      secretCode: `BESTIE-${Date.now().toString(36).toUpperCase()}`
    };
    setBesties([...besties, newBestie]);
    setSelectedBestie(newBestie);
  };

  const handleUpdateField = (field, value) => {
    setBestieContent(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPhoto = () => {
    // In real app, this would handle file upload
    const newPhoto = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    setBestieContent(prev => ({
      ...prev,
      photos: [...prev.photos, newPhoto]
    }));
  };

  const handleRemovePhoto = (index) => {
    setBestieContent(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleAddSong = () => {
    const newSong = {
      id: bestieContent.playlist.length + 1,
      title: '',
      artist: '',
      link: ''
    };
    setBestieContent(prev => ({
      ...prev,
      playlist: [...prev.playlist, newSong]
    }));
  };

  const handleUpdateSong = (id, field, value) => {
    setBestieContent(prev => ({
      ...prev,
      playlist: prev.playlist.map(song => 
        song.id === id ? { ...song, [field]: value } : song
      )
    }));
  };

  const handleRemoveSong = (id) => {
    setBestieContent(prev => ({
      ...prev,
      playlist: prev.playlist.filter(song => song.id !== id)
    }));
  };

  const handleAddJoke = () => {
    if (bestieContent.jokes.length < 20) {
      const newJoke = '';
      setBestieContent(prev => ({
        ...prev,
        jokes: [...prev.jokes, newJoke]
      }));
    }
  };

  const handleUpdateJoke = (index, value) => {
    const newJokes = [...bestieContent.jokes];
    newJokes[index] = value;
    setBestieContent(prev => ({ ...prev, jokes: newJokes }));
  };

  const handleRemoveJoke = (index) => {
    setBestieContent(prev => ({
      ...prev,
      jokes: prev.jokes.filter((_, i) => i !== index)
    }));
  };

  const handleAddQuestion = () => {
    if (bestieContent.questions.length < 10) {
      const newQuestion = {
        id: Date.now(),
        question: '',
        answer: ''
      };
      setBestieContent(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    }
  };

  const handleUpdateQuestion = (id, value) => {
    setBestieContent(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === id ? { ...q, question: value } : q
      )
    }));
  };

  const handleRemoveQuestion = (id) => {
    setBestieContent(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const handleAddReason = () => {
    if (bestieContent.reasons.length < 10) {
      const newReason = '';
      setBestieContent(prev => ({
        ...prev,
        reasons: [...prev.reasons, newReason]
      }));
    }
  };

  const handleUpdateReason = (index, value) => {
    const newReasons = [...bestieContent.reasons];
    newReasons[index] = value;
    setBestieContent(prev => ({ ...prev, reasons: newReasons }));
  };

  const handleRemoveReason = (index) => {
    setBestieContent(prev => ({
      ...prev,
      reasons: prev.reasons.filter((_, i) => i !== index)
    }));
  };

  const handlePublish = () => {
    alert('Content published successfully! Your bestie can now access their personalized page.');
  };

  const handleDeleteBestie = () => {
    setBesties(besties.filter(b => b.id !== selectedBestie.id));
    if (besties.length > 1) {
      setSelectedBestie(besties[1]);
    } else {
      setSelectedBestie(null);
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="dashboard">
      {/* Top Navigation Bar */}
      <header className="top-bar">
        <div className="top-bar-left">
          <div className="admin-profile">
            <img src={profileData.profilePic} alt="Admin" className="admin-avatar" />
            <div className="admin-info">
              <h3>{profileData.name}</h3>
              <p className="admin-role">BestieSpace Admin</p>
            </div>
          </div>
        </div>
        <div className="top-bar-right">
          <button 
            className="profile-button"
            onClick={() => setShowProfileModal(true)}
          >
            👤 Profile Settings
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Left Sidebar - Besties List */}
        <aside className="sidebar">
          <button className="create-bestie-btn" onClick={handleCreateBestie}>
            + Create New Bestie
          </button>
          <div className="besties-list">
            <h3 className="besties-title">Your Besties</h3>
            {besties.map(bestie => (
              <div 
                key={bestie.id}
                className={`bestie-item ${selectedBestie?.id === bestie.id ? 'active' : ''}`}
                onClick={() => setSelectedBestie(bestie)}
              >
                <div className="bestie-avatar">👯</div>
                <div className="bestie-info">
                  <h4>{bestie.name}</h4>
                  <p className="bestie-nickname">{bestie.nickname}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Basic Bestie Info */}
          <section className="content-section">
            <h2>Basic Bestie Info</h2>
            <div className="form-group-row">
              <div className="form-group">
                <label>Bestie Full Name *</label>
                <input 
                  type="text" 
                  value={bestieContent.fullName}
                  onChange={(e) => handleUpdateField('fullName', e.target.value)}
                  placeholder="Enter bestie's full name"
                />
              </div>
              <div className="form-group">
                <label>Nickname (Unique)</label>
                <input 
                  type="text" 
                  value={bestieContent.nickname}
                  onChange={(e) => handleUpdateField('nickname', e.target.value)}
                  placeholder="Enter nickname"
                />
              </div>
              <div className="form-group">
                <label>Secret Code</label>
                <input 
                  type="text" 
                  value={bestieContent.secretCode}
                  readOnly
                  className="read-only"
                />
                <small>Auto-generated unique code for bestie access</small>
              </div>
            </div>
          </section>

          {/* Song Dedication */}
          <section className="content-section">
            <h2>🎵 Song Dedication</h2>
            <div className="song-dedication">
              <div className="song-options">
                <div className="option-group">
                  <input type="radio" id="upload" name="songType" checked={bestieContent.song.type === 'upload'} 
                    onChange={() => handleUpdateField('song', { ...bestieContent.song, type: 'upload' })} />
                  <label htmlFor="upload">Upload Video File</label>
                </div>
                <div className="option-group">
                  <input type="radio" id="link" name="songType" checked={bestieContent.song.type === 'link'} 
                    onChange={() => handleUpdateField('song', { ...bestieContent.song, type: 'link' })} />
                  <label htmlFor="link">Paste Video/Song Link</label>
                </div>
              </div>
              {bestieContent.song.type === 'link' ? (
                <input 
                  type="text" 
                  placeholder="Paste YouTube, Spotify, or Apple Music link"
                  value={bestieContent.song.url}
                  onChange={(e) => handleUpdateField('song', { ...bestieContent.song, url: e.target.value })}
                  className="song-link-input"
                />
              ) : (
                <div className="upload-area">
                  <div className="upload-placeholder">
                    <span>📁</span>
                    <p>Click to upload video file</p>
                    <small>MP4, MOV, or AVI up to 100MB</small>
                  </div>
                </div>
              )}
              {bestieContent.song.preview && (
                <div className="song-preview">
                  <h4>Preview</h4>
                  <div className="preview-player">
                    <div className="player-placeholder">
                      <span>▶️</span>
                      <p>Song dedication preview</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Messages Section */}
          <section className="content-section">
            <h2>💌 Messages</h2>
            <p className="section-description">These messages will appear as two separate paragraphs on your bestie's page</p>
            <div className="messages-grid">
              <div className="form-group">
                <label>Message Part 1</label>
                <textarea 
                  value={bestieContent.messages.part1}
                  onChange={(e) => handleUpdateField('messages', { ...bestieContent.messages, part1: e.target.value })}
                  placeholder="Write your first message..."
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Message Part 2</label>
                <textarea 
                  value={bestieContent.messages.part2}
                  onChange={(e) => handleUpdateField('messages', { ...bestieContent.messages, part2: e.target.value })}
                  placeholder="Write your second message..."
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* Photo Gallery */}
          <section className="content-section">
            <h2>📸 Photo Gallery</h2>
            <p className="section-description">Gallery expands automatically on the bestie page based on uploaded images</p>
            <div className="gallery-grid">
              {bestieContent.photos.map((photo, index) => (
                <div key={index} className="gallery-item">
                  <img src={photo} alt={`Memory ${index + 1}`} />
                  <button 
                    className="remove-photo"
                    onClick={() => handleRemovePhoto(index)}
                    aria-label="Remove photo"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="gallery-item add-photo" onClick={handleAddPhoto}>
                <span>+</span>
                <p>Add Photo</p>
              </div>
            </div>
          </section>

          {/* Music Playlist */}
          <section className="content-section">
            <h2>🎶 Dedicated Playlist</h2>
            <div className="playlist-header">
              <p>Songs that remind you of your bestie</p>
              <button className="add-item-btn" onClick={handleAddSong}>
                + Add Song
              </button>
            </div>
            {bestieContent.playlist.map((song) => (
              <div key={song.id} className="playlist-item">
                <div className="song-fields">
                  <input 
                    type="text" 
                    placeholder="Song Title"
                    value={song.title}
                    onChange={(e) => handleUpdateSong(song.id, 'title', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Artist"
                    value={song.artist}
                    onChange={(e) => handleUpdateSong(song.id, 'artist', e.target.value)}
                  />
                  <input 
                    type="text" 
                    placeholder="Spotify/YouTube/Apple Music Link"
                    value={song.link}
                    onChange={(e) => handleUpdateSong(song.id, 'link', e.target.value)}
                  />
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveSong(song.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </section>

          {/* Jokes Section */}
          <section className="content-section">
            <h2>😂 Inside Jokes</h2>
            <div className="jokes-header">
              <p>Add up to 20 jokes that only you two understand</p>
              <div className="counter">
                {bestieContent.jokes.filter(j => j.trim()).length} / 20 jokes
              </div>
            </div>
            {bestieContent.jokes.map((joke, index) => (
              <div key={index} className="joke-item">
                <input 
                  type="text" 
                  value={joke}
                  onChange={(e) => handleUpdateJoke(index, e.target.value)}
                  placeholder={`Inside joke #${index + 1}`}
                />
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveJoke(index)}
                >
                  ×
                </button>
              </div>
            ))}
            {bestieContent.jokes.length < 20 && (
              <button className="add-btn" onClick={handleAddJoke}>
                + Add Joke
              </button>
            )}
          </section>

          {/* Questions Section */}
          <section className="content-section">
            <h2>❓ Questions I Want to Ask You</h2>
            <div className="questions-header">
              <p>Add up to 10 questions for your bestie to answer</p>
              <div className="counter">
                {bestieContent.questions.filter(q => q.question.trim()).length} / 10 questions
              </div>
            </div>
            {bestieContent.questions.map((q) => (
              <div key={q.id} className="question-item">
                <input 
                  type="text" 
                  value={q.question}
                  onChange={(e) => handleUpdateQuestion(q.id, e.target.value)}
                  placeholder="Enter your question"
                />
                <div className="answer-preview">
                  <label>Bestie's response will appear here:</label>
                  <div className="answer-placeholder">
                    <span>💭</span>
                    <p>Waiting for bestie's answer...</p>
                  </div>
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveQuestion(q.id)}
                >
                  Remove
                </button>
              </div>
            ))}
            {bestieContent.questions.length < 10 && (
              <button className="add-btn" onClick={handleAddQuestion}>
                + Add Question
              </button>
            )}
          </section>

          {/* Reasons Section */}
          <section className="content-section">
            <h2>❤️ 10 Reasons Why I Love You</h2>
            <div className="reasons-header">
              <p>Add heartfelt reasons one by one</p>
              <div className="counter">
                {bestieContent.reasons.filter(r => r.trim()).length} / 10 reasons
              </div>
            </div>
            {bestieContent.reasons.map((reason, index) => (
              <div key={index} className="reason-item">
                <span className="reason-number">{index + 1}</span>
                <input 
                  type="text" 
                  value={reason}
                  onChange={(e) => handleUpdateReason(index, e.target.value)}
                  placeholder={`Reason #${index + 1}`}
                />
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveReason(index)}
                >
                  ×
                </button>
              </div>
            ))}
            {bestieContent.reasons.length < 10 && (
              <button className="add-btn" onClick={handleAddReason}>
                + Add Reason
              </button>
            )}
          </section>

          {/* Publish & Share Section */}
          <section className="content-section publish-section">
            <h2>🚀 Publish & Share</h2>
            <div className="publish-content">
              <button className="publish-btn" onClick={handlePublish}>
                Publish Bestie Content
              </button>
              <div className="access-link-area">
                <h4>Bestie Access Link</h4>
                <div className="link-input-group">
                  <input 
                    type="text" 
                    value={`https://bestiespace.com/view/${bestieContent.secretCode}`}
                    readOnly
                    className="access-link-input"
                  />
                  <button className="copy-btn">📋 Copy Link</button>
                  <button className="share-btn">📤 Share</button>
                </div>
                <p className="helper-text">
                  Share this link with your bestie. They will enter their secret code to view their content.
                </p>
              </div>
            </div>
          </section>

          {/* Delete Bestie Section */}
          <section className="content-section danger-zone">
            <h2>⚠️ Danger Zone</h2>
            <div className="danger-content">
              <p>Deleting this bestie will permanently remove all their data, including messages, photos, and memories.</p>
              <button 
                className="delete-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Bestie
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Profile Settings</h2>
              <button className="modal-close" onClick={() => setShowProfileModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Admin Info */}
              <section className="modal-section">
                <h3>Admin Information</h3>
                <div className="profile-pic-upload">
                  <img src={profileData.profilePic} alt="Profile" />
                  <button className="upload-btn">📁 Upload New Photo</button>
                </div>
                <div className="modal-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={profileData.name} readOnly />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={profileData.email} readOnly />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Re-enter new password" />
                  </div>
                  <button className="save-btn">Save Changes</button>
                </div>
              </section>

              {/* Referral Section */}
              <section className="modal-section">
                <h3>Invite friends to BestieSpace</h3>
                <div className="referral-section">
                  <p className="referral-text">Share your referral link with friends:</p>
                  <div className="referral-input-group">
                    <input 
                      type="text" 
                      value="https://bestiespace.com/ref/JAMIE123"
                      readOnly
                      className="referral-link"
                    />
                    <button className="copy-btn">📋 Copy Link</button>
                  </div>
                  <p className="referral-note">Referral rewards coming soon.</p>
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
              <h2>⚠️ Delete Bestie</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="warning-message">
                <p>Are you sure you want to delete <strong>{selectedBestie?.name}</strong>?</p>
                <p>This action cannot be undone. All data for this bestie will be permanently deleted:</p>
                <ul>
                  <li>All messages and photos</li>
                  <li>Playlist and song dedications</li>
                  <li>Jokes, questions, and reasons</li>
                  <li>Access link and secret code</li>
                </ul>
              </div>
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn"
                  onClick={handleDeleteBestie}
                >
                  Yes, Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;