# Delta Twin - web application

Platform for displaying the current status of the Delta Centre's study and research facility, utilizing real-time data from the building’s automation system and various deployed sensors.

https://github.com/thugoo/client-delta-twin/assets/16036779/b930d955-c1b9-4e74-9d4b-13d0ecfbac4d

**This project contains the source code for the web application developed with Next.js.**  
Project containing the source code for the backend services can be found [here.](https://github.com/thugoo/api-delta-twin)

Web application is available at http://172.17.89.119.nip.io. Access requires a connection to the UT VPN.

<br>

## Workflow flowchart

![Workflow](workflow-flowchart.svg)

<br>

## Project structure
```
/
│   ...
│   docker-compose.yaml                // Defines services, networks, and volumes for all containers
│   Dockerfile                         // Defines the steps to build the Docker image for the main application
│   ...
│   workflow-flowchart.svg             // Workflow flowchart
│
├───public
│
└───src
    └───app
        │   ...
        │   page.js                   // Main page of the web application
        │   ...
        │
        ├───Components
        │   ├───DataFilter            // Data type filtering buttons
        │   ├───FirstFloor            // First floor
        │   ├───FloorFilter           // Floor filtering buttons
        │   ├───Popup                 // Pop-up window
        │   ├───SearchBar             // Search bar
        │   ├───SecondFloor           // Second floor
        │   └───SideBar               // Side panel
        │
        └───display
                page.js               // Visualizations based on filters specified in the URL parameters
```

<br>

## Deployment

The web application utilizes Docker for deployment

To build and start the container, follow these steps:

1. Open your terminal and navigate to the project directory.  

2. Ensure that the "apiUrl" value in \src\app\api.js matches the API service's URL.  

3. Run the command `docker compose up --build` in your terminal.  


