"use strict";

// Setup to read from AWS dunamoDb
const DynamoDb = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDb.DocumentClient({ region: "ap-southeast-2" });

module.exports.createNote = async (event, context, callback) => {
  let data = JSON.parse(event.body);

  try {
    const params = {
      TableName: "notes", // Get table from DynamoDb AWS
      Item: {
        notesId: data.id, // ID
        title: data.title, // Title
        body: data.body // Other Text
      },
      ConditionExpression: "attribute_not_exists(notesId)" // If condition ( data.id === data.id ) { error }
    };
    await documentClient.put(params).promise(); // Promice
    callback(null, {
      // When everything successfully is done we are doing callBack function
      statusCode: 201,
      body: JSON.stringify(data)
    });
  } catch (err) {
    callback(null, {
      // If its not successfully callBack function
      statusCode: 500, // Server Error
      body: JSON.stringify(err.message) //Error message
    });
  }
};

module.exports.updateNote = async event => {
  let notesId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with ${notesId} has been updated!`)
  };
};

module.exports.deleteNote = async event => {
  let notesId = event.pathParameters.id;
  return {
    statusCode: 200,
    body: JSON.stringify(`The note with id: ${notesId} has been deleted!`)
  };
};

module.exports.getAllNotes = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify("All notes are returned")
  };
};
