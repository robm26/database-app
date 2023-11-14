# database-app
Web application for testing and comparing data access patterns with DynamoDB and MySQL 

DynamoDB offers fast, predictable latency and unlimited scale via an API interface.

## Problem

There are many similarities and some important differences between developing on relational database development
and DynamoDB. As a developer, you may need to:

 * Understand the performance of DynamoDB when evaluating it for use in your application
 * Learn DynamoDB's API
 * Understand how to port existing SQL commands to DynamoDB


## Solution

Before migrating to DynamoDB, you can use this web application to
compare and contrast the features and performance of each database service.

## Features 
A query editor and job system will allow you to perform very similar access patterns to each database. 
With DynamoDB you can use PartiQL, a query language that is similar to SQL.

A job system allows users to create simple scripts that generate sample records. 
Each sample record is created by a function called *rowMaker* that accepts a tick, or iteration number. 
The job execution function will then loop through and call rowMaker with the loop counter to generate a unique item.


## Setup 
The application runs as a React app using the [remix.run](https://remix.run) framework.
This is a popular and robust framework that is an extension of the React Router package. 
The app has a back-end as well as front end layer. 
The back end runs on a shell environment and can automatically use the AWS IAM identity that has been setup using the AWS CLI.
The web app itself has no login page, and is intended for personal and educational use.

### Pre-requisites
 * AWS account
 * AWS CLI setup with IAM identity with programmatic access
 * Node JS
 * Existing MySQL database that is accessible, knowing the hostname, username, password. Create a database called **database-app**.

### Steps
You can deploy this to your laptop 
1. git clone this repository 
2. cd into the folder ```database-app```
3. run ```npm install```
4. Update the MySQL connection settings in ```/app/components/mysql-credentials.mjs```
5. Run ```npm run dev```
6. Open a browser and navigate to ```http://localhost:3000```  
7. If you are in Cloud9, instead click the Preview button on the top bar (next to the Run button) and then click Preview Running Application.
The web app loads in the bottom right corner. You can un-dock this browser into a full-screen experience via the arrow link button on the right side.

### Demo steps
There is a top navbar on the page.
1. Click to the Setup tab
2. Notice the connection details shown in color
3. Click the two large buttons to deploy tables to both MySQL and DynamoDB.
4. Click to the Query tab
5. Run the default query against MySQL and DynamoDB. No records are returned.
6. Click to the Jobs tab. This will show a list of job script files from the folder ```/jobs```
7. Click on the job called ```load-initial-data```
8. Click on View Code to see the job code. 
9. Click on Preview to see a summary of the first five items the job creates.
10. Click the run job button **MySQL**
11. Click the run job button **DynamoDB**
12. Return to the Query tab
13. Run the default query again on MySQL and DynamoDB, observe results and latencies

### Customize jobs
You can copy and paste job files to create a new job. Then you can edit the job code to customize the sample items returned.
You should see the job appear in the Job list now and can Preview and Run it.

### Next steps
The project roadmap includes:
 * An experiment system where the latencies from a job or two similar jobs will be stored as .CSV files in the /experiments folder
 * A charting system that will plot the latencies over time, showing statistical summaries of each.
