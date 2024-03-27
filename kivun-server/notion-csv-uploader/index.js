// index.js
require('dotenv').config();
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { addItem } = require('./notion');

const app = express();
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's actual origin
    credentials: true, // To allow cookies and authorization headers with CORS
  };
  
app.use(cors(corsOptions));
const uploadsDir = path.join(__dirname, 'uploads');
const filesDir = path.join(__dirname, 'files');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}

// Configuration for uploading to 'uploads' directory
const upload = multer({ dest: 'uploads/' });

// Configuration for saving files locally in 'files' directory
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filesDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadFile = multer({ storage: fileStorage });
const port = 8080;

app.post('/upload-csv-notion', upload.single('file'), (req, res) => {
    console.log("I am in notion upload");
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      results.forEach((row) => {
        addItem(row.Name);
      });
      fs.unlinkSync(req.file.path);
      res.send('CSV processed and data added to Notion.');
    });
});

// New endpoint for uploading files locally to 'files' directory
app.post('/upload-csv', uploadFile.single('file'), (req, res) => {
    console.log("I am in upload local!!");
    console.log("file is: ", req.file);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log(`req.file.filename= ${req.file.filename}`)
  res.send(`File saved locally as ${req.file.filename}`);
});

app.get('/api/files', (req, res) => {
  const fileName = req.query.name;

  if (fileName) {
      // Return the contents of a specific CSV file
      const filePath = path.join(filesDir, fileName);
      const results = [];
      fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => {
              res.json(results);
          })
          .on('error', (err) => {
              console.error('Error reading file:', err);
              res.status(500).send('Failed to read file');
          });
  } else {
      // List all CSV files
      fs.readdir(filesDir, (err, files) => {
          if (err) {
              console.error('Error listing files:', err);
              res.status(500).send('An error occurred while listing files.');
          } else {
              const csvFiles = files.filter(file => file.endsWith('.csv'));
              res.json(csvFiles);
          }
      });
  }
});

app.get('/api/files/content', (req, res) => {
  console.log("I am in content");
  const { fileName } = req.query; // Expect a "fileName" query parameter
  if (!fileName) {
      return res.status(400).send('File name is required');
  }
  const filePath = path.join(filesDir, fileName);
  try {
      const results = [];
      fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => res.json(results));
  } catch (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Failed to read file');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});