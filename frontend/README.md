# Pet App Frontend

This is the frontend application for the **Pet App**, built with **React Native** and **Expo**. The app enables users to manage pet profiles, track pet health records, and set reminders related to pet care. It provides a clean, intuitive interface designed for both pet owners and caregivers.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Project Structure](#project-structure)  
- [Usage](#usage)  
- [State Management](#state-management)  
- [API Integration](#api-integration)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## Project Overview

The Pet App Frontend provides a mobile interface that interacts with a backend API to manage pets and their health data. Users can:

- Register and log in  
- Add and view pet profiles  
- Record health data (vaccinations, treatments)  
- Set and receive reminders for pet care tasks  

The app uses Redux for managing global state and Tailwind CSS-inspired styling for a responsive UI.

---

## Features

- **User Authentication**: Secure login and registration flows  
- **Pet Profiles**: Create, view, and update multiple pets per user  
- **Health Records**: Log vaccinations, medical history, and other health-related info  
- **Reminders**: Schedule alerts for medications, vet visits, or other important tasks  
- **Responsive Design**: Works smoothly across multiple devices and screen sizes  

---

## Tech Stack

- **React Native** – Cross-platform mobile framework  
- **Expo** – Toolchain for building native apps  
- **Redux Toolkit** – Efficient state management  
- **Tailwind CSS (via NativeWind)** – Utility-first styling  
- **Axios** – API requests  
- **React Navigation** – App routing  
- **Tanstack Query** - To handle API calls

---

## Getting Started

### Prerequisites

- Node.js (>=14.x)  
- npm or yarn   
- A device/emulator or Expo Go app

### Installation

```bash
git clone https://github.com/Ojoinioluwa/pet-app-frontend.git
cd pet-app-frontend
npm install

npx expo start
```
--- 
## Project structure

```bash
pet-app-frontend/
├── app/                  # Main app components and screens
├── assets/               # Static assets like images
├── components/           # Reusable UI components
├── constants/            # App-wide constants
├── redux/                # Redux slices and store configuration
├── services/             # API services and endpoints
├── utils/                # Helper functions
├── App.js                # Entry point of the app
├── package.json
└── README.md
```

## Usage
- Launch the app and register a new account or log in.

- Add pets by specifying their details and uploading images.

- Access individual pet profiles to view or edit information.

- Navigate to the Health section to add or view health records.

- Use the Reminders feature to schedule pet care activities.

## State Management
- The app uses Redux Toolkit for global state management, including:

- Authentication State: Logged-in user info and token storage

- Pet Data: List of pets and current pet profile

- Health Records: Fetched and posted health entries per pet

- Reminders: Scheduled tasks and alert statuses

- Redux slices are modular and located in the `redux/` directory.

---

## API Integration

All network requests are managed using **Axios**, with a centralized configuration for token-based authentication and error handling.

- **Base URL:** Configured in the `services/` layer  
- **Authentication:** Token sent via `Authorization` header  
- **Error Handling:** Managed globally and per request  

> **Note:** Ensure the backend server is running and accessible from your development device.

---

## Contributing

Contributions are welcome!

1. Fork the repository  
2. Create a new branch  
   ```bash
   git checkout -b feature/your-feature-name
   git commit -m 'Add some feature'
   git push origin feature/your-feature-name
   ```
---

## License
This project is licensed under MIT License

---

## Contact

- **Author:** Ojoinioluwa
- **GitHub:** [@Ojoinioluwa](https://github.com/Ojoinioluwa)
- **Project Repo:** [Pet App Frontend](https://github.com/Ojoinioluwa/pet-app-frontend)
- **Email:** [ojoinioluwa05@gmail.com](mailto:ojoinioluwa05@gmail.com)



