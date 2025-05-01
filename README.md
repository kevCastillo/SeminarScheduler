# Seminar Scheduler System

A comprehensive web application for scheduling, managing, and tracking academic seminars, built with ASP.NET.

## Table of Contents
- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

## Overview

The Seminar Scheduler System allows educational institutions to effectively manage course schedules, faculty assignments, and seminar coordination. Users can create, track, and export scheduling information for academic planning.

## System Requirements

### Hardware Requirements
- Minimum 8GB RAM (16GB recommended)
- Modern CPU with x64 architecture
- 1GB of available disk space
- Internet connection
- Standard input/output devices

### Software Requirements
- Operating System: Windows 10 or Windows 11
- Microsoft Visual Studio 2022 (Community Edition or higher)
- .NET Framework 4.8 or later
- Web Browser (Chrome, Firefox, or Edge recommended)
- GoDaddy Hosting Account (for production deployment)

## Installation

### Step 1: Install Required Software
1. Download and install Visual Studio 2022 from [Microsoft's website](https://visualstudio.microsoft.com/downloads/)
2. During installation, select the following workloads:
   - ASP.NET and web development
   - .NET desktop development
   - Data storage and processing
3. Include ".NET Entity Framework" in the individual components

### Step 2: Set Up the Project
1. Clone this repository or download the source code
2. Extract to your preferred location (e.g., `C:\Projects\Seminar_Scheduler`)
3. Open the solution in Visual Studio:
   - Launch Visual Studio 2022
   - Select "Open a project or solution"
   - Navigate to the extracted folder
   - Select the solution file (`SeminarScheduler.sln`)
   - Click "Open"

## Database Setup

Initialize the database using Entity Framework:

1. Open the solution in Visual Studio
2. Open Package Manager Console (Tools > NuGet Package Manager > Package Manager Console)
3. Run the command: `Update-Database`

This will create the local database and apply all migrations to set up the required tables and relationships.

## Configuration

### Connection String
The application is configured to use a local database by default. The connection string can be found in the Web.config or appsettings.json file:

```xml
<add name="DefaultConnection" 
     connectionString="Data Source=(LocalDb)\MSSQLLocalDB;AttachDbFilename=|DataDirectory|\SeminarScheduler.mdf;Initial Catalog=SeminarScheduler;Integrated Security=True" 
     providerName="System.Data.SqlClient" />
```

### System Preferences
1. Navigate to "System Settings"
2. Under "Appearance":
   - Select a color scheme for different course types
   - Adjust UI preferences
3. Click "Save Changes"

### Data Management
1. Navigate to "Data Management"
2. Click "Import Data" to import faculty and course information
3. To export data, go to the Calendar tab and use the export feature

## Running Locally

1. In Visual Studio, press F5 or click the "Start" button (green play icon)
2. The application will build and launch in your default web browser
3. The local URL will typically be something like http://localhost:44300/
4. Log in with your credentials or create a new account

## Deployment

### Publishing to GoDaddy Hosting

#### Prepare Your GoDaddy Hosting Account
1. Ensure your hosting plan supports ASP.NET applications
2. Create a MySQL database through your GoDaddy control panel:
   - Note the database name, username, password, and server address

#### Publish from Visual Studio
1. Right-click on the project in Solution Explorer
2. Select "Publish"
3. Click "New Profile"
4. Select "FTP" as the publish method
5. Enter your GoDaddy FTP details:
   - Server: Your GoDaddy FTP server (usually ftp.yourdomain.com)
   - Site path: Usually /httpdocs or /www
   - Username: Your FTP username
   - Password: Your FTP password
6. Configure deployment settings:
   - Update the connection string to use your GoDaddy database
   - Enable "Remove additional files at destination" and "Precompile during publishing"
7. Click "Publish" to deploy the application

#### Finalize Database Setup
1. Generate SQL script for your Entity Framework database:
   - In Package Manager Console, run: `Script-Migration -Idempotent`
2. Import the schema to your GoDaddy database using phpMyAdmin

## Troubleshooting

### Common Installation Issues
- **Database Connection Errors**: Verify connection strings and ensure LocalDB is running
- **Build Errors**: Ensure all NuGet packages are restored and references are valid
- **Publishing Errors**: Verify FTP credentials and hosting compatibility

### Runtime Issues
- **Performance Issues**: Check database query performance and server resources
- **UI Issues**: Test in different browsers and clear cache if needed

## Support

If you need assistance regarding an error or have any questions, please contact any member of our support team:

- Ethan Norales De La Rosa – Software Requirements Manager - enoralesdelarosa@islander.tamucc.edu
- Abraham Gonzalez – Software Technical Manager – agonzalez123@islander.tamucc.edu
- Kevin Castillo – Software Developer – kcastillo@islander.tamucc.edu

For urgent support issues, please email all team members and include "URGENT: Seminar Scheduler Support" in the subject line.
