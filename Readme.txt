#### Application Overview #####

This application provide users with a seamless experience in managing their car inventory. Built using FastAPI, MongoDB, and React, the application offers a robust set of features with a focus on security, performance, and usability.


## Key Features 

1. **User Authentication and Authorization** 

   - The application employs a secure user authentication and authorization system using JSON Web Tokens (JWT). This ensures that only authenticated users with the proper permissions can access the application's features.
   - Certain routes within the application are protected and can only be accessed by authenticated users. Unauthorized access attempts are met with appropriate error responses, maintaining the integrity of sensitive data and functionality.
   - To enhance security and user experience, the application implements an automatic refresh token mechanism. Users can obtain new access tokens without having to re-enter their credentials, reducing the risk of unauthorized access.


2. **Functionalities**

   - The application supports full CRUD (Create, Read, Update, Delete) operations, allowing users to manage seamlessly through the user interface.
   - Advanced search and filtering functionalities enable users to efficiently locate relevant data within the application based on various criteria.


3. **Secure Data Transmission:** 
   - All data transmitted between the client and server is encrypted using industry-standard encryption protocols, ensuring the confidentiality and integrity of user data.


4. **Basic Caching Mechanism:** 
    - A basic caching mechanism optimizes performance by temporarily storing frequently accessed data.

## Table of Contents
1. Getting Started
   - Prerequisites
   - Installation
2. Backend Setup
   - Setting Up the Backend Server
   - Running the Backend Server
3. Frontend Setup
   - Setting Up the Frontend Application
   - Running the Frontend Application
4. Using the Application
   - Logging In
   - Navigating the Dashboard
5. API Documentation
6. Additional Information
   - Contact



## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Python
- Node.js and npm
- MongoDB

### Installation
1. **Clone the repository:**
    ```bash
    git clone https://github.com/Hafimuthasir/car-inventory.git
    ```
2. **Navigate to the project directory:**

## Backend Setup

### Setting Up the Backend Server
1. **Create and activate a virtual environment:**
    ```
    python -m venv venv
    source venv/bin/activate  # For Linux/macOS
    venv\Scripts\activate.bat  # For Windows
    ```
2. **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3. **Configure the mongodb database name and connection in main.py based on your setup**

(Haven't configured the setup of environment variables to simplify the testing process.)


### Running the Backend Server
Start the backend server:
```bash
uvicorn main:app --reload
(Make sure the server is running in port 8000)


## Frontend Setup

### Setting Up the Frontend Application

1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the frontend development server:
   npm run dev


Using the Application
Logging In
Access the application at http://localhost:3000.
Make your account by going to signup page
Login using created credentials.
Navigating the Dashboard
Once logged in, you will be redirected to the dashboard, where you can do all the functionalities.


API Documentation
The API documentation can be found at http://localhost:8000/docs.


Contact
For further assistance or you encounter any issues, contact at email:muthasirhafi@gmail.com phone:+917994805975

