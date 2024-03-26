import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './upload.css'; // Make sure this CSS file exists and is styled

function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false); // New state to track uploading status

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first.');
            return;
        }

        setUploading(true); // Start uploading

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // Adjust the URL if your server is hosted elsewhere
            const response = await fetch('http://localhost:8080/upload-csv', {
                method: 'POST',
                // mode: 'no-cors',
                credentials: 'include',
                body: formData,
                
            });
            console.log("response is: " , response);
            if (response.ok) {
                alert('File uploaded successfully to the server.');
            } else {
                alert('Failed to upload file to the server.');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file to the server.');
        } finally {
            setUploading(false); // Reset uploading status
            setSelectedFile(null); // Reset selected file
        }
    };

    return (
        <div className="csv-uploader">
            <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="file-input"
                disabled={uploading} // Disable input during upload
            />
            {selectedFile && (
                <div className="file-details">
                    <span>{selectedFile.name}</span>
                    <button onClick={handleUpload} disabled={uploading}>Upload</button>
                </div>
            )}
            {uploading && <div>Uploading...</div>}
            <Link to={'/'}>Back</Link>        

        </div>
    );
}

export default Upload;
