// notion.js
require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function addItem(title) {
    console.log("auth: process.env.NOTION_TOKEN: ", process.env.NOTION_TOKEN);
    console.log("process.env.NOTION_DATABASE_ID: "+ databaseId);
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: { content: title },
            },
          ],
        },
        // Add other properties here based on your database schema
      },
    });
    console.log('Entry added to Notion:', title);
  } catch (error) {
    console.error('Error adding entry to Notion:', error.body);
  }
}

module.exports = { addItem };