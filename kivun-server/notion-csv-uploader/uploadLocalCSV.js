const fs = require('fs');
const csvParser = require('csv-parser');
const { addItem } = require('./notion');

function uploadLocalCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        // Here you can process the results, for example, adding items to Notion
        for (let row of results) {
          addItem(row.Name).catch(reject);
        }
        resolve();
      })
      .on('error', reject);
  });
}

module.exports = { processCSV };
