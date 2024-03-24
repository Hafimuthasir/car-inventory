Prerequisites
Make sure you have the following installed on your system:

Node.js
npm (Node Package Manager)

## Getting Started

Clone the repository to your local machine.
git clone <repository-url>
Navigate to the React frontend directory.
cd <frontend-directory>
Install the dependencies.
npm install

## Configuration
Update the API endpoint in the axios requests. Open the src/components/HomePage.js file and modify the following lines:
'http://localhost:8000';
Replace 'http://localhost:8000' with the base URL of your Grocery Backend API.


## Running the Application
Once everything is set up, you can run the application using the following command:
npm run dev
This will start the development server, and you can view the application in your web browser at http://localhost:5173.

## Usage
The application provides a simple interface for adding grocery items to the list. It communicates with the backend API to fetch and display existing items. Use the provided form to add new items, and the list will dynamically update.

## Message
Focused more on the functionality and not on the design. If you have any questions or encounter issues, don't hesitate to ask.