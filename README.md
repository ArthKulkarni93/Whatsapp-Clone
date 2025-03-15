# WhatsApp Clone - Real-Time Chat Platform with WebSockets, React, PostgreSQL, and Prisma

This repository showcases a WhatsApp clone with real-time chat functionality using **WebSockets**, **React**, **PostgreSQL**, and **Prisma** for backend and frontend operations.

The project demonstrates how to build a scalable real-time application with multiple features such as real-time messaging, typing indicators, chat history storage, and more.

## Tech Stack

- **Backend:**
  - **Node.js** and **Express** for building the server.
  - **WebSockets (`ws` library)** for real-time communication between the server and clients.
  - **Prisma ORM** and **PostgreSQL** for storing chat history and user data.
  
- **Frontend:**
  - **React.js** for building the dynamic user interface.
  - **CSS** and **HTML** for styling and markup.
  
- **Others:**
  - **npm** or **yarn** for dependency management.
  
## Folder Structure

### Backend (BE)

1. **`6/6BE/`** - Backend for WhatsApp Clone
   - **Description**: Implements backend functionalities such as handling WebSocket connections, storing chat history in PostgreSQL, and managing user rooms.
   - **Tech Stack**: Node.js, Express, WebSockets, PostgreSQL, Prisma.

### Frontend (FE)

2. **`6/6FE/`** - Frontend for WhatsApp Clone
   - **Description**: Implements the user interface for interacting with the WebSocket server, displaying chat rooms, messages, and typing indicators.
   - **Tech Stack**: React.js, CSS, WebSocket client.

## Current Features

### 1. **Multiple Rooms Logic**
   - Users can join different rooms and send messages to specific rooms. Messages in one room will not affect other rooms, ensuring a clean and organized chat system.

### 2. **Typing Indicator**
   - Real-time typing feature that notifies users when someone is typing a message in the same room.

### 3. **Chat History with PostgreSQL**
   - All chat messages are stored in PostgreSQL, ensuring that message history is available for future retrieval. This is powered by Prisma ORM, providing an easy-to-use database abstraction.

### Future Features

- **User List in Room**: Display the list of active users in a particular room.
- **Private Rooms**: Allow users to create private rooms with restricted access.

## Setup Instructions

### Prerequisites

- **Node.js** (v12 or higher)
- **npm** or **yarn** for managing dependencies.
- **PostgreSQL** for storing the chat history (with Prisma setup).

### How to Run the Project

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ArthKulkarni93/Whatsapp-Clone.git
   cd Whatsapp-Clone
   ```

2. **Install dependencies**:
   - Navigate to the backend folder (`6/6BE`) and frontend folder (`6/6FE`), and install the required dependencies.
   
   For Backend:
   ```bash
   cd 6/6BE
   npm install
   ```

   For Frontend:
   ```bash
   cd 6/6FE
   npm install
   ```

3. **Setup Database**:
   - Ensure your PostgreSQL database is running and Prisma is properly configured to connect to your database.
   - Run the Prisma migrations to set up your database:
   ```bash
   npx prisma migrate dev
   ```

4. **Start the Backend Server**:
   ```bash
   cd 6/6BE
   node server.js
   ```

5. **Start the Frontend Development Server**:
   ```bash
   cd 6/6FE
   npm run dev
   ```

6. **Open the application** in your browser by visiting `http://localhost:5173`.

## Notes

- The backend WebSocket server listens for incoming connections from the frontend and broadcasts messages in real-time across rooms.
- The frontend React application allows users to connect to different rooms and interact with other users.

