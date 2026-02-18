# Support Ticket System

A full-stack support ticket system built with Django (Backend), React (Frontend), and Docker.
Includes LLM integration for auto-categorization and priority suggestion of tickets.

## Tech Stack

- **Backend:** Django, Django REST Framework
- **Database:** PostgreSQL
- **Frontend:** React, TypeScript, Vite
- **Infrastructure:** Docker, Docker Compose
- **LLM Integration:** OpenAI (Configurable)

## Prerequisites

- Docker Desktop installed and running.
- An OpenAI API Key (or compatible LLM API Key).

## Setup & Running

1.  **Clone the repository** (if not already downloaded).
2.  **Create a `.env` file** in the root directory with your LLM API Key:
    ```env
    LLM_API_KEY=sk-your-api-key-here
    ```
3.  **Run the application:**
    ```bash
    docker-compose up --build
    ```
4.  **Access the application:**
    - Frontend: http://localhost:5173 (or port 3000 depending on configuration)
    - Backend API: http://localhost:8000/api/

## Features

- **Ticket Management:** Create, Read, Update tickets.
- **LLM Auto-Classification:** Automatically suggests category and priority based on description.
- **Filtering & Search:** Filter by status, priority, category. Search by title/description.
- **Stats Dashboard:** View aggregated metrics (using DB-level aggregation).

## Design Decisions

- **Django & DRF:** Chosen for robust backend capabilities and ease of REST API creation.
- **React & Vite:** fast, modern frontend development.
- **Docker:** Ensures consistent environment across different machines.
- **LLM Abstraction:** Service layer design for LLM integration allows swapping providers easily.

