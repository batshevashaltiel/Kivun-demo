import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './present.css'

const Present = () => {
    const [files, setFiles] = useState([]);
    const [selectedFileContent, setSelectedFileContent] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/files') // Fetch list of file names
            .then(response => response.json())
            .then(setFiles)
            .catch(error => console.error('Error fetching files:', error));
    }, []);

    const handleFileSelection = (fileName) => {
        setSelectedFileName(fileName);
        fetch(`http://localhost:8080/api/files/content?fileName=${encodeURIComponent(fileName)}`)
            .then(response => response.json())
            .then(setSelectedFileContent)
            .catch(error => console.error('Error fetching file content:', error));
    };

    return (
        <div>
            <h1>CSV Files</h1>
            <ul>
                {files.map(file => (
                    <li key={file} onClick={() => handleFileSelection(file)} style={{ cursor: 'pointer' }}>
                        {file}
                    </li>
                ))}
            </ul>
            {selectedFileContent && selectedFileContent.length > 0 && (
                <>
                    <h2>Contents of {selectedFileName}</h2>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(selectedFileContent[0]).map(key => (
                                    <th key={key}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {selectedFileContent.map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).map((value, index) => (
                                        <td key={index}>{value}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            <Link to={'/'}>Back</Link>        
            </div>
    );
};

export default Present;