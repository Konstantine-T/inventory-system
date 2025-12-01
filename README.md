# Inventory Management System

A full-stack inventory management application with Angular frontend and Node.js/Express backend.

## Installation & Setup

### 1. Clone the Repository

git clone <repository-url>
cd inventory-system

### 2. Backend Setup

#### a. Install Dependencies

cd Backend
npm install

#### b. Configure Environment Variables

Create a .env file in the Backend directory:

# Database Configuration
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=inventory_db
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
PORT=3001
NODE_ENV=development

#### c. Create PostgreSQL Database

Make sure PostgreSQL is running, then create the database:

npm run db:create

This creates a database named inventory_db.

#### d. Run Migrations

Create the required tables (locations and inventories):

npm run db:migrate

#### e. Seed the Database

Populate the database with initial location data:

npm run db:seed

This creates the following locations:

- Tbilisi
- Batumi
- Kutaisi

#### f. Generate Test Data

To populate the database with sample inventory items:

npm run generate-test-data

This creates 100+ random inventory items across different locations.

### 3. Frontend Setup

#### a. Install Dependencies

cd Frontend/inventory-app
npm install

## Running the Application

### Start Backend Server

cd Backend
npm run dev

The backend will start on [http://localhost:3001]


### Start Frontend Server

In a new terminal:

cd Frontend/inventory-app
npm start

The Angular app will start on [http://localhost:4200]

## Development Workflow

1. Start PostgreSQL service
2. Run backend: cd Backend && npm run dev
3. Run frontend: cd Frontend/inventory-app && npm start
4. Access application at [http://localhost:4200]
