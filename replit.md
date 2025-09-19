# Livestock Health Meter

## Overview

The Livestock Health Meter is a comprehensive agricultural technology platform designed for livestock health monitoring and management. The system serves multiple user roles including farmers, veterinarians, buyers, and administrators, providing tools for cattle tracking, health records management, disease detection, feeding schedules, vaccination tracking, sales transactions, and analytics reporting. The application emphasizes data clarity, operational efficiency, and real-time health monitoring with support for both English and Urdu languages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built as a React single-page application using TypeScript and modern React patterns. The architecture follows a component-based approach with:

- **UI Framework**: React with TypeScript for type safety and developer experience
- **Component Library**: Radix UI primitives with custom shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with a custom design system supporting both light and dark themes
- **State Management**: React Query (@tanstack/react-query) for server state management and React Context for application state (authentication and language preferences)
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

The application implements role-based authentication with different user interfaces for farmers, veterinarians, buyers, and administrators. The design system draws inspiration from agricultural technology platforms with emphasis on health status visualization using color-coded indicators (green for healthy, orange for sick, red for critical).

### Backend Architecture
The server-side follows a RESTful API architecture built with:

- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the entire stack
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **File Upload**: Multer middleware for handling cattle image uploads
- **API Design**: RESTful endpoints organized by resource type with proper error handling and request validation

The backend implements comprehensive CRUD operations for all livestock management entities including cattle, health records, vaccinations, feeding schedules, disease detections, and sales transactions.

### Database Design
The system uses PostgreSQL with a well-structured relational schema:

- **Users Table**: Multi-role user system (farmer, veterinarian, buyer, admin)
- **Cattle Table**: Core livestock entity with RFID tracking, health status, and ownership
- **Health Records**: Medical history tracking with veterinarian associations
- **Vaccinations**: Immunization schedules and tracking
- **Feeding Records**: Nutrition management and feeding logs
- **Feed Inventory**: Stock management for different feed types
- **Disease Detection**: AI-powered disease identification results
- **Sales Transactions**: Commercial transaction records
- **Alerts**: System notifications for health concerns and scheduling

The schema supports comprehensive livestock management with proper relationships and constraints to maintain data integrity.

### Development Infrastructure
The application uses modern development tooling:

- **Build System**: Vite for fast development and optimized production builds
- **Development Environment**: Hot module replacement and error overlays for efficient development
- **Code Quality**: TypeScript for static type checking across the entire codebase
- **Database Migrations**: Drizzle Kit for schema management and database migrations

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database for persistent data storage, configured via DATABASE_URL environment variable
- **Neon Database**: Serverless PostgreSQL provider with WebSocket connection support

### Authentication & Security
- **JWT**: JSON Web Tokens for stateless authentication
- **bcrypt**: Password hashing and verification
- **Secure Sessions**: Session management with proper token validation

### File Storage
- **Local File System**: Cattle image storage with multer handling uploads
- **Image Processing**: Support for JPEG, JPG, and PNG formats with size limitations

### Frontend Libraries
- **Radix UI**: Accessible component primitives for building the user interface
- **Recharts**: Data visualization library for analytics and reporting charts
- **Lucide Icons**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework for responsive design

### Development Tools
- **Replit Integration**: Development environment integration with runtime error handling and cartographer plugin
- **Google Fonts**: Typography support for Inter (English) and Noto Sans Arabic (RTL support)
- **ESBuild**: Fast JavaScript bundler for production builds

The system is designed to be scalable and maintainable with clear separation of concerns between frontend presentation, backend business logic, and data persistence layers.