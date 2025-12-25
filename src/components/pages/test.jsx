// frontend/src/components/FileUploadArea.jsx
import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const FileUploadArea = ({ 
  onUpload, 
  accept, 
  maxSizeMB = 100, 
  type = 'image',
  endpoint = '/upload/besties/gallery',
  additionalData = {},
  multiple = false,
  label = 'Drag & drop or click to upload'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      if (multiple) {
        await handleMultipleFiles(files);
      } else {
        await handleFile(files[0]);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      if (multiple) {
        await handleMultipleFiles(files);
      } else {
        await handleFile(files[0]);
      }
    }
  };

  const handleMultipleFiles = async (files) => {
    const uploadPromises = files.map(file => handleFile(file));
    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(r => r !== null);
      toast.success(`Successfully uploaded ${successfulUploads.length} files`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Some files failed to upload');
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    const validTypes = getValidTypes(type);
    if (!validTypes.includes(file.type)) {
      toast.error(`Invalid file type. Please upload ${getFileTypeDescription(type)}`);
      return null;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
      return null;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Add additional data
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      // Upload to backend endpoint
      const response = await api.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || file.size)
          );
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        const uploadData = {
          url: response.data.url,
          publicId: response.data.publicId,
          type: file.type,
          size: file.size,
          name: file.name,
          originalFile: file,
          resourceType: response.data.resourceType,
          duration: response.data.duration
        };

        onUpload({
            uploadData,
            
            
        });
        toast.success(response.data.message || `${getFileTypeName(type)} uploaded successfully!`);
        return uploadData;
      } else {
        toast.error(response.data.message || 'Upload failed');
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getValidTypes = (fileType) => {
    switch (fileType) {
      case 'video':
        return ['video/mp4', 'video/quicktime', 'video/avi', 'video/x-msvideo'];
      case 'audio':
        return ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4'];
      case 'image':
        return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      default:
        return ['image/jpeg', 'image/png'];
    }
  };

  const getFileTypeDescription = (fileType) => {
    switch (fileType) {
      case 'video': return 'MP4, MOV, or AVI';
      case 'audio': return 'MP3, WAV, or OGG';
      case 'image': return 'JPEG, PNG, or GIF';
      default: return 'valid files';
    }
  };

  const getFileTypeName = (fileType) => {
    switch (fileType) {
      case 'video': return 'Video';
      case 'audio': return 'Audio';
      case 'image': return 'Image';
      default: return 'File';
    }
  };

  const getUploadIcon = () => {
    if (uploading) return '⏳';
    switch (type) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'image': return '🖼️';
      default: return '📁';
    }
  };

  const getFileSizeText = () => {
    switch (type) {
      case 'video': return `MP4, MOV, AVI up to ${maxSizeMB}MB`;
      case 'audio': return `MP3, WAV, OGG up to ${maxSizeMB}MB`;
      case 'image': return `JPEG, PNG, GIF up to ${maxSizeMB}MB`;
      default: return `Files up to ${maxSizeMB}MB`;
    }
  };

  return (
    <>
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        <span className="upload-icon">{getUploadIcon()}</span>
        {uploading ? (
          <>
            <p>Uploading... {uploadProgress}%</p>
            <div className="upload-progress">
              <div 
                className="upload-progress-bar" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <small>Please don't close the browser</small>
          </>
        ) : (
          <>
            <p>{label}</p>
            <small>{getFileSizeText()}</small>
            {multiple && <small>Select multiple files</small>}
          </>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
        disabled={uploading}
        multiple={multiple}
      />
    </>
  );
};

export default FileUploadArea;

// import React, { useState, useRef } from 'react';
// import toast from 'react-hot-toast';
// import api from '../../api/axios';

// const FileUploadArea = ({ 
//   onUpload, 
//   accept, 
//   maxSizeMB = 100, 
//   type = 'image',
//   endpoint,
//   additionalData = {},
//   multiple = false,
//   label = 'Drag & drop or click to upload'
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const files = Array.from(e.dataTransfer.files);
//     if (files.length > 0) {
//       if (multiple) {
//         await handleMultipleFiles(files);
//       } else {
//         await handleFile(files[0]);
//       }
//     }
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       if (multiple) {
//         await handleMultipleFiles(files);
//       } else {
//         await handleFile(files[0]);
//       }
//     }
//   };

//   const handleMultipleFiles = async (files) => {
//     const uploadPromises = files.map(file => handleFile(file));
//     try {
//       const results = await Promise.all(uploadPromises);
//       const successfulUploads = results.filter(r => r !== null);
//       toast.success(`Successfully uploaded ${successfulUploads.length} files`);
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Some files failed to upload');
//     }
//   };

//   const handleFile = async (file) => {
//     // Validate file type
//     const validTypes = getValidTypes(type);
//     if (!validTypes.includes(file.type)) {
//       toast.error(`Invalid file type. Please upload ${getFileTypeDescription(type)}`);
//       return null;
//     }

//     // Validate file size
//     const maxSize = maxSizeMB * 1024 * 1024;
//     if (file.size > maxSize) {
//       toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
//       return null;
//     }

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       // Create FormData
//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Add additional data
//       Object.keys(additionalData).forEach(key => {
//         formData.append(key, additionalData[key]);
//       });

//       // Upload to backend endpoint
//       const response = await api.post(endpoint, formData, {
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setUploadProgress(progress);
//         },
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         const uploadData = {
//           url: response.data.url,
//           publicId: response.data.publicId,
//           type: file.type,
//           size: file.size,
//           name: file.name,
//           originalFile: file,
//           resourceType: response.data.resourceType
//         };

//         onUpload(uploadData);
//         toast.success(response.data.message || `${getFileTypeName(type)} uploaded successfully!`);
//         return uploadData;
//       } else {
//         toast.error(response.data.message || 'Upload failed');
//         return null;
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.response?.data?.message || 'Failed to upload file');
//       return null;
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const getValidTypes = (fileType) => {
//     switch (fileType) {
//       case 'video':
//         return ['video/mp4', 'video/quicktime', 'video/avi', 'video/x-msvideo'];
//       case 'audio':
//         return ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4'];
//       case 'image':
//         return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       default:
//         return ['image/jpeg', 'image/png'];
//     }
//   };

//   const getFileTypeDescription = (fileType) => {
//     switch (fileType) {
//       case 'video': return 'MP4, MOV, or AVI';
//       case 'audio': return 'MP3, WAV, or OGG';
//       case 'image': return 'JPEG, PNG, or GIF';
//       default: return 'valid files';
//     }
//   };

//   const getFileTypeName = (fileType) => {
//     switch (fileType) {
//       case 'video': return 'Video';
//       case 'audio': return 'Audio';
//       case 'image': return 'Image';
//       default: return 'File';
//     }
//   };

//   const getUploadIcon = () => {
//     if (uploading) return '⏳';
//     switch (type) {
//       case 'video': return '🎬';
//       case 'audio': return '🎵';
//       case 'image': return '🖼️';
//       default: return '📁';
//     }
//   };

//   const getFileSizeText = () => {
//     switch (type) {
//       case 'video': return `MP4, MOV, AVI up to ${maxSizeMB}MB`;
//       case 'audio': return `MP3, WAV, OGG up to ${maxSizeMB}MB`;
//       case 'image': return `JPEG, PNG, GIF up to ${maxSizeMB}MB`;
//       default: return `Files up to ${maxSizeMB}MB`;
//     }
//   };

//   return (
//     <>
//       <div 
//         className={`upload-area ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={handleClick}
//         style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
//       >
//         <span className="upload-icon">{getUploadIcon()}</span>
//         {uploading ? (
//           <>
//             <p>Uploading... {uploadProgress}%</p>
//             <div className="upload-progress">
//               <div 
//                 className="upload-progress-bar" 
//                 style={{ width: `${uploadProgress}%` }}
//               ></div>
//             </div>
//           </>
//         ) : (
//           <>
//             <p>{label}</p>
//             <small>{getFileSizeText()}</small>
//             {multiple && <small>Select multiple files</small>}
//           </>
//         )}
//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept={accept}
//         style={{ display: 'none' }}
//         disabled={uploading}
//         multiple={multiple}
//       />
//     </>
//   );
// };

// export default FileUploadArea;




// // components/FileUploadArea.jsx
// import React, { useState, useRef } from 'react';
// import toast from 'react-hot-toast';
// import api from '../api/axios'; // Use your existing axios instance

// const FileUploadArea = ({ 
//   onUpload, 
//   accept, 
//   maxSizeMB = 100, 
//   type = 'video',
//   endpoint = '/besties/upload/image',
//   multiple = false,
//   label = 'Drag & drop or click to upload'
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const files = Array.from(e.dataTransfer.files);
//     if (files.length > 0) {
//       if (multiple) {
//         await handleMultipleFiles(files);
//       } else {
//         await handleFile(files[0]);
//       }
//     }
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       if (multiple) {
//         await handleMultipleFiles(files);
//       } else {
//         await handleFile(files[0]);
//       }
//     }
//   };

//   const handleMultipleFiles = async (files) => {
//     const uploadPromises = files.map(file => handleFile(file));
//     try {
//       const results = await Promise.all(uploadPromises);
//       toast.success(`Successfully uploaded ${results.length} files`);
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Some files failed to upload');
//     }
//   };

//   const handleFile = async (file) => {
//     // Validate file type
//     const validTypes = getValidTypes(type);
//     if (!validTypes.includes(file.type)) {
//       toast.error(`Invalid file type. Please upload ${getFileTypeDescription(type)}`);
//       return null;
//     }

//     // Validate file size
//     const maxSize = maxSizeMB * 1024 * 1024;
//     if (file.size > maxSize) {
//       toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
//       return null;
//     }

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       // Create FormData
//       const formData = new FormData();
//       formData.append('file', file);
      
//       // Get folder based on endpoint
//       const folder = getFolderFromEndpoint(endpoint);
//       if (folder) {
//         formData.append('folder', folder);
//       }

//       // Upload to your backend endpoint
//       const response = await api.post(endpoint, formData, {
//         onUploadProgress: (progressEvent) => {
//           const progress = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setUploadProgress(progress);
//         },
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       if (response.data.success) {
//         const uploadData = {
//           url: response.data.url,
//           publicId: response.data.publicId,
//           type: file.type,
//           size: file.size,
//           name: file.name,
//           originalFile: file,
//           dbId: response.data.id
//         };

//         onUpload(uploadData);
//         toast.success(`${getFileTypeName(type)} uploaded successfully!`);
//         return uploadData;
//       } else {
//         toast.error(response.data.message || 'Upload failed');
//         return null;
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error(error.response?.data?.message || 'Failed to upload file');
//       return null;
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const getValidTypes = (fileType) => {
//     switch (fileType) {
//       case 'video':
//         return ['video/mp4', 'video/quicktime', 'video/avi', 'video/x-msvideo'];
//       case 'audio':
//         return ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
//       case 'image':
//         return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       default:
//         return ['image/jpeg', 'image/png'];
//     }
//   };

//   const getFileTypeDescription = (fileType) => {
//     switch (fileType) {
//       case 'video': return 'MP4, MOV, or AVI';
//       case 'audio': return 'MP3, WAV, or OGG';
//       case 'image': return 'JPEG, PNG, or GIF';
//       default: return 'valid files';
//     }
//   };

//   const getFileTypeName = (fileType) => {
//     switch (fileType) {
//       case 'video': return 'Video';
//       case 'audio': return 'Audio';
//       case 'image': return 'Image';
//       default: return 'File';
//     }
//   };

//   const getFolderFromEndpoint = (endpoint) => {
//     if (endpoint.includes('/admin/')) return 'bestiespace/admin';
//     if (endpoint.includes('/gallery/')) return 'bestiespace/gallery';
//     if (endpoint.includes('/song/')) return 'bestiespace/songs';
//     if (endpoint.includes('/playlist/')) return 'bestiespace/playlist';
//     return 'bestiespace/uploads';
//   };

//   const getUploadIcon = () => {
//     if (uploading) return '⏳';
//     switch (type) {
//       case 'video': return '🎬';
//       case 'audio': return '🎵';
//       case 'image': return '🖼️';
//       default: return '📁';
//     }
//   };

//   const getFileSizeText = () => {
//     switch (type) {
//       case 'video': return `MP4, MOV, AVI up to ${maxSizeMB}MB`;
//       case 'audio': return `MP3, WAV, OGG up to ${maxSizeMB}MB`;
//       case 'image': return `JPEG, PNG, GIF up to ${maxSizeMB}MB`;
//       default: return `Files up to ${maxSizeMB}MB`;
//     }
//   };

//   return (
//     <>
//       <div 
//         className={`upload-area ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={handleClick}
//         style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
//       >
//         <span className="upload-icon">{getUploadIcon()}</span>
//         {uploading ? (
//           <>
//             <p>Uploading... {uploadProgress}%</p>
//             <div className="upload-progress">
//               <div 
//                 className="upload-progress-bar" 
//                 style={{ width: `${uploadProgress}%` }}
//               ></div>
//             </div>
//           </>
//         ) : (
//           <>
//             <p>{label}</p>
//             <small>{getFileSizeText()}</small>
//             {multiple && <small>Select multiple files</small>}
//           </>
//         )}
//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept={accept}
//         style={{ display: 'none' }}
//         disabled={uploading}
//         multiple={multiple}
//       />
//     </>
//   );
// };

// export default FileUploadArea;



// // components/FileUploadArea.jsx
// import React, { useState, useRef } from 'react';
// import toast from 'react-hot-toast';
// import axios from 'axios';

// const FileUploadArea = ({ 
//   onUpload, 
//   accept, 
//   maxSizeMB = 100, 
//   type = 'video',
//   endpoint = '/besties/upload/image',
//   multiple = false,
//   label = 'Drag & drop or click to upload'
// }) => {
//   const [isDragging, setIsDragging] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const fileInputRef = useRef(null);

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = async (e) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const files = Array.from(e.dataTransfer.files);
//     if (files.length > 0) {
//       if (multiple) {
//         await handleMultipleFiles(files);
//       } else {
//         await handleFile(files[0]);
//       }
//     }
//   };

//   const handleClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       if (multiple) {
//         await handleMultipleFiles(files);
//       } else {
//         await handleFile(files[0]);
//       }
//     }
//   };

//   const handleMultipleFiles = async (files) => {
//     const uploadPromises = files.map(file => handleFile(file));
//     try {
//       const results = await Promise.all(uploadPromises);
//       toast.success(`Successfully uploaded ${results.length} files`);
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Some files failed to upload');
//     }
//   };

//   const handleFile = async (file) => {
//     // Validate file type
//     const validTypes = getValidTypes(type);
//     if (!validTypes.includes(file.type)) {
//       toast.error(`Invalid file type. Please upload ${getFileTypeDescription(type)}`);
//       return null;
//     }

//     // Validate file size
//     const maxSize = maxSizeMB * 1024 * 1024;
//     if (file.size > maxSize) {
//       toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
//       return null;
//     }

//     try {
//       setUploading(true);
//       setUploadProgress(0);

//       // Create FormData for the upload
//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      
//       // Determine folder based on type
//       const folder = getCloudinaryFolder(type);
//       if (folder) {
//         formData.append('folder', folder);
//       }

//       // Upload to Cloudinary
//       const cloudinaryResponse = await axios.post(
//         `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`,
//         formData,
//         {
//           onUploadProgress: (progressEvent) => {
//             const progress = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setUploadProgress(progress);
//           },
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (cloudinaryResponse.data.secure_url) {
//         // Store Cloudinary URL in our database via API
//         const dbResponse = await axios.post(endpoint, {
//           cloudinaryUrl: cloudinaryResponse.data.secure_url,
//           publicId: cloudinaryResponse.data.public_id,
//           fileType: type,
//           originalName: file.name,
//           size: file.size,
//         });

//         if (dbResponse.data.success) {
//           const uploadData = {
//             url: cloudinaryResponse.data.secure_url,
//             publicId: cloudinaryResponse.data.public_id,
//             type: file.type,
//             size: file.size,
//             name: file.name,
//             originalFile: file,
//             dbId: dbResponse.data.id // If backend returns saved document ID
//           };

//           onUpload(uploadData);
//           toast.success(`${getFileTypeName(type)} uploaded successfully!`);
//           return uploadData;
//         }
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast.error('Failed to upload file');
//       return null;
//     } finally {
//       setUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const getValidTypes = (fileType) => {
//     switch (fileType) {
//       case 'video':
//         return ['video/mp4', 'video/quicktime', 'video/avi', 'video/x-msvideo'];
//       case 'audio':
//         return ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
//       case 'image':
//         return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
//       default:
//         return ['image/jpeg', 'image/png'];
//     }
//   };

//   const getFileTypeDescription = (fileType) => {
//     switch (fileType) {
//       case 'video': return 'MP4, MOV, or AVI';
//       case 'audio': return 'MP3, WAV, or OGG';
//       case 'image': return 'JPEG, PNG, or GIF';
//       default: return 'valid files';
//     }
//   };

//   const getFileTypeName = (fileType) => {
//     switch (fileType) {
//       case 'video': return 'Video';
//       case 'audio': return 'Audio';
//       case 'image': return 'Image';
//       default: return 'File';
//     }
//   };

//   const getCloudinaryFolder = (fileType) => {
//     switch (fileType) {
//       case 'video': return 'bestiespace/videos';
//       case 'audio': return 'bestiespace/audio';
//       case 'image': return 'bestiespace/images';
//       default: return 'bestiespace/files';
//     }
//   };

//   const getUploadIcon = () => {
//     if (uploading) return '⏳';
//     switch (type) {
//       case 'video': return '🎬';
//       case 'audio': return '🎵';
//       case 'image': return '🖼️';
//       default: return '📁';
//     }
//   };

//   const getFileSizeText = () => {
//     switch (type) {
//       case 'video': return `MP4, MOV, AVI up to ${maxSizeMB}MB`;
//       case 'audio': return `MP3, WAV, OGG up to ${maxSizeMB}MB`;
//       case 'image': return `JPEG, PNG, GIF up to ${maxSizeMB}MB`;
//       default: return `Files up to ${maxSizeMB}MB`;
//     }
//   };

//   return (
//     <>
//       <div 
//         className={`upload-area ${isDragging ? 'dragging' : ''} ${uploading ? 'uploading' : ''}`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={handleClick}
//         style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
//       >
//         <span className="upload-icon">{getUploadIcon()}</span>
//         {uploading ? (
//           <>
//             <p>Uploading... {uploadProgress}%</p>
//             <div className="upload-progress">
//               <div 
//                 className="upload-progress-bar" 
//                 style={{ width: `${uploadProgress}%` }}
//               ></div>
//             </div>
//           </>
//         ) : (
//           <>
//             <p>{label}</p>
//             <small>{getFileSizeText()}</small>
//             {multiple && <small>Select multiple files</small>}
//           </>
//         )}
//       </div>
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleFileChange}
//         accept={accept}
//         style={{ display: 'none' }}
//         disabled={uploading}
//         multiple={multiple}
//       />
//     </>
//   );
// };

// export default FileUploadArea;