# Task Management Application

The Task Management Application is a feature-rich web application that allows users to efficiently manage their tasks and categories. It provides a seamless user experience through a combination of RESTful APIs, GraphQL, and gRPC for efficient communication and data retrieval.

## Overview

The Task Management Application is designed to streamline task and category management for users. With a robust set of features, users can easily create, update, delete, and view tasks and categories, as well as assign tasks to users for effective collaboration. The application provides a smooth user experience through RESTful APIs, GraphQL, and gRPC, ensuring efficient communication and data retrieval.

## Features

- User Management:
  - Register new users.
  - Login securely using authentication mechanisms.

- Category Management:
  - Create, update, and delete categories.
  - Retrieve a list of categories or view a specific category by its ID.

- Task Management:
  - Create tasks and associate them with existing categories.
  - Update and delete tasks.
  - View a list of tasks or access specific tasks.
  - Assign tasks to users for effective collaboration.
  - Users can view their assigned tasks and perform relevant operations.

## Technologies Used

- RESTful API: Allows clients to interact with the application using standard HTTP methods, providing easy integration and compatibility with various platforms.

- GraphQL: Enables clients to request and retrieve specific data efficiently, reducing over-fetching and under-fetching scenarios.

- gRPC: Provides high-performance, bi-directional communication between clients and the server, utilizing protocol buffers for efficient serialization and deserialization.

- Authentication: Implements secure authentication mechanisms such as JWT (JSON Web Tokens) to protect user data and ensure authorized access.

## Installation and Setup

1. Clone the repository:

git clone https://github.com/your-username/your-repository.git

2. Install the required dependencies:

npm install

3. Configure the database connection:

- Create a MySQL database with the name `exam`.
- Import the database file "exam.sql" into your local server (Wamp,Xampp) phpmyadmin.

4. Start the server:

- Use the `concurrently` package to run multiple commands concurrently.
- Install `concurrently` globally (if not already installed):

  ```
  npm install -g concurrently
  ```

- Run the following command to start all microservices concurrently:

  ```
  concurrently "nodemon apiGateway.js" "nodemon microservices/categoryMicroService.js" "nodemon microservices/taskMicroService.js" "nodemon microservices/userMicroservice.js" "nodemon microservices/user_tasksMicroservice.js"
  ```

5. Access the application:

- Use the provided endpoints to interact with the application via RESTful API.
- Use the GraphQL playground to perform GraphQL queries and mutations.

For detailed installation and setup instructions, please refer to the [Installation Guide](docs/INSTALLATION.md) in the repository.

## API Documentation

Comprehensive API documentation with detailed descriptions of each endpoint, request/response examples, and authentication requirements can be found in the [API Documentation](docs/API_DOCS.md) file.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow the guidelines outlined in the [Contributing Guide](CONTRIBUTING.md).

## License

This project is licensed under the MIT License.

