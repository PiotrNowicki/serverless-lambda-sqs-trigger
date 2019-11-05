'use strict';

const AWS = require('aws-sdk');
const SQS = new AWS.SQS({apiVersion: '2012-11-05'});

const queueUrl = process.env.SQS_TASKS_URL;

module.exports.createTask = async event => {
    return new Promise((resolve) => {
        console.info("Scheduling a task for later invocation.");


        const params = {
            MessageBody: JSON.stringify("My Scheduled Task"),
            QueueUrl: queueUrl
        };

        SQS.sendMessage(params, (err, data) => {
            if (err) {
                throw "Task not scheduled";
            }

            resolve({
                statusCode: 202,
                body: "Task scheduled"
            });
        });
    });
};

module.exports.executeTask = async event => {
    console.info('Received task to be executed.');

    // We can do this "[0]" thanks to "batchSize: 1" - otherwise, be prepared for a list of events
    const result = tryToProcess(event.Records[0].body);

    console.info("Correctly processed the message with result: %s", result);
};

// This simulates some business logic process - here we're just getting some random responses
const tryToProcess = (requestData) => {
    if (Math.round(Math.random()) === 0) {
        throw "Need to wait for some third-party system, try again later";
    }

    return "Success";
};