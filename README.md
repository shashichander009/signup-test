# React-Django Fullstack Project

This is a sample project showcasing a fullstack application where the frontend is built with React, and the backend is built with Django REST Framework (DRF). The application allows the user to enter their name, sends it to the backend API, and displays a personalized greeting returned by the backend.

## Prerequisites

Before running the project, ensure you have the following installed on your system:

- Python 3.8+
- Node.js (v14+ recommended) and npm (comes with Node.js)
- Django 3.2+ and Django REST Framework

## Setup Instructions

### Backend Setup (Django)

1. Clone the repository and navigate to the backend directory:

    ```bash
    git clone <repo_url>
    cd backend
    ```

2. Create and activate a virtual environment:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install the required Python packages:

    ```bash
    pip install -r requirements.txt
    ```

4. Apply database migrations:

    ```bash
    python manage.py migrate
    ```

5. Start the development server:

    ```bash
    python manage.py runserver
    ```

The backend API will be accessible at `http://127.0.0.1:8000`.

### Frontend Setup (React)

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install the required npm packages:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm start
    ```

The frontend will be accessible at `http://localhost:3000`.

## Running the Project

1. Ensure both the backend (`http://127.0.0.1:8000`) and frontend (`http://localhost:3000`) servers are running.
2. Open the frontend in your browser and enter your name in the input box.
3. Click "Submit" to send your name to the backend API.
4. View the greeting message returned by the backend displayed on the frontend.

## API Details

**Endpoint:** `/api/greet/`  
**Method:** POST  

### Request Body:

```json
{
    "name": "YourName"
}
# signup-test
