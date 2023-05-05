"use strict";

// Setup to read from AWS dunamoDb
const DynamoDb = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDb.DocumentClient({ region: "ap-southeast-2" });
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME; // Fetch NOTES_TABLE_NAME FROM serverless.yml !!

const send = (statusCode, data) => {
  return {
    statusCode,
    body: JSON.stringify(data)
  };
};

module.exports.createNote = async (event, context, callback) => {
  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME, // Get table from DynamoDb AWS
      Item: {
        notesId: data.id, // ID
        title: data.title, // Title
        body: data.body // Other Text
      },
      ConditionExpression: "attribute_not_exists(notesId)" // If condition ( data.id === data.id ) { error }
    };
    await documentClient.put(params).promise(); // Promice
    callback(null, send(201, data));
  } catch (err) {
    callback(null, send(500, err.message));
  }
};

module.exports.updateNote = async (event, context, cb) => {
  let notesId = event.pathParameters.id;
  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: notesId
      },
      UpdateExpression: "set #title = :title, #body = :body", // Set title and body to the value set down to it
      ExpressionAttributeNames: {
        // Define Names
        "#title": "title",
        "#body": "body"
      },
      ExpressionAttributeValues: {
        // Define Data
        ":title": data.title,
        ":body": data.body
      },
      ConditionExpression: "attribute_exists(notesId)" // Update only if item is available
    };
    await documentClient.update(params).promise(); // Promise that all is good
    cb(null, send(200, data));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};

module.exports.deleteNote = async (event, context, cb) => {
  let notesId = event.pathParameters.id;

  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: {
        notesId: notesId
      },
      ConditionExpression: "attribute_exists(notesId)" // Update only if item is available
    };
    await documentClient.delete(params).promise(); // Promise that all is good and document can be deleted
    cb(null, send(200, notesId));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};

module.exports.getAllNotes = async (event, context, cb) => {
  try {
    const params = {
      TableName: NOTES_TABLE_NAME
    };
    const notes = await documentClient.scan(params).promise();
    cb(null, send(200, notes));
  } catch (err) {
    cb(null, send(500, err.message));
  }
};
