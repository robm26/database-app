# database-app
Web application for testing and comparing data access patterns with DynamoDB and MySQL 

## Problem

DynamoDB offers fast, predictable latency and unlimited scale via an API interface. 

There are many similarities and some important differences between developing on relational database development
and DynamoDB. 

## Solution

Before migrating to DynamoDB, you can use this web application to
compare and contrast the features and performance of each database service.

## Features 
A query editor and job system will allow you to perform very similar access patterns to each database. 
With DynamoDB you can use PartiQL, a query language that is similar to SQL.

## Setup 

### Pre-requisites
 * AWS account
 * AWS CLI setup with IAM identity with programmatic access
 * Node JS
 * Existing MySQL database that is accessible, knowing the hostname, username, password. Create a database called *database-app*.

### Steps
You can deploy this to your laptop 
1. git clone this repository 
2. cd into the folder ```database-app```
3. run ```npm install```
4. Update the MySQL connection settings in ```/app/components/mysql-credentials.mjs```
5. Run ```npm run dev```
6. Open a browser and navigate to ```http://localhost:3000```  (If you are in Cloud9, click the Preview button on the top bar to open the preview web browser)

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
10. Click the run job button *MySQL*
11. Click the run job button *DynamoDB*
12. Return to the Query tab
13. Run the default query again on MySQL and DynamoDB, observe results and latencies

### Customize jobs
You can copy and paste job files to create a new job. Then you can edit the job code to customize the sample items returned.
You should see the job appear in the Job list now and can Preview and Run it.

### Next steps
The project roadmap includes:
 * An experiment system where the latencies from a job or two similar jobs will be stored as .CSV files in the /experiments folder
 * A charting system that will plot the latencies over time, showing statistical summaries of each.
