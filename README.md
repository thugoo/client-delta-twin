# Delta Twin

Platform for visualizing the current status of the Delta Centre's study and research facility. It uses real-time data collected from the building's automation system and various deployed sensors.

Platform is available at http://172.17.89.119.nip.io. Access requires a connection to the UT VPN.

The platform is composed of data querying services, an API for broadcasting data, and a web application.

**This project includes the source code for the web application built using Next.js.**

Project containing the source code for the data querying services and the API can be found here: https://gitlab.ut.ee/hugo.martin.teemus/api-delta-twin

Diagram of the workflow:

![Workflow](workflow.svg)

<br>

# Deploying the web application

The web application is deployed using Docker.

To build the image and start the container running the web application, navigate to the project directory in your terminal.

Then, execute the following command:
`sudo docker compose up --build`

This command builds the necessary Docker image and starts the container.