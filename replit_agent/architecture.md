# Architecture Overview

## 1. Overview

This project is a full-stack web application for ECM Digital, a service-oriented business focused on UX/UI, web development, marketing, AI integration, and automation. The application serves as both a client-facing catalog for services and an internal management system with client and admin panels. The system supports multiple languages (Polish and German) and integrates with external service catalogs.

The application follows a modern client-server architecture with a React-based frontend and a Node.js Express backend. It utilizes PostgreSQL for data storage via Drizzle ORM.

## 2. System Architecture

The application follows a traditional three-tier architecture:

1. **Presentation Layer**: React-based frontend with Tailwind CSS for styling
2. **Application Layer**: Express.js backend with REST API endpoints
3. **Data Layer**: PostgreSQL database accessed via Drizzle ORM

### Key Architectural Patterns:

- **API-First Design**: Clear separation between frontend and backend with a well-defined REST API
- **Component-Based UI**: Frontend built with reusable React components
- **Query-Based Data Fetching**: Tanstack React Query for efficient data fetching and caching
- **ORM-Based Data Access**: Drizzle ORM for type-safe database operations
- **Internationalization (i18n)**: Multiple language support via i18next

## 3. Key Components

### Frontend Architecture

- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: Tanstack React Query for server state, React hooks for local state
- **UI Components**: Custom components built with Radix UI and styled with Tailwind CSS
- **Animation**: Framer Motion for UI animations
- **Internationalization**: i18next for multi-language support

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **API Routes**: RESTful endpoints organized by domain
- **Database Access**: Drizzle ORM for PostgreSQL
- **File Storage**: Local file system and potentially Firebase Storage
- **Authentication**: Session-based authentication (appears to be in development)
- **External Integrations**: OpenAI API, service catalog proxy

### Database Schema

The database schema includes the following main entities:

1. **Users**: Authentication and user management
   - Roles: client, admin, agent

2. **Services**: Service catalog offerings
   - Including pricing, descriptions, features, and configuration options

3. **Orders**: Customer orders for services
   - Including configuration, contact info, and pricing

4. **Project Files**: Files attached to projects/orders

5. **Messages**: Communication between users related to orders

6. **Project Notes**: Notes related to specific projects/orders

7. **Project Milestones**: Key progress points for projects

## 4. Data Flow

### Main Data Flows:

1. **Service Browsing and Configuration**:
   - User browses available services
   - User selects and configures a service
   - System calculates total price based on configuration
   - User provides contact information and places order
   - Order is stored in the database

2. **Order Management**:
   - Admin views incoming orders
   - Admin assigns orders to team members
   - Users update order status
   - Client can view their order status

3. **Client-Agency Communication**:
   - Messages are exchanged between clients and agency staff
   - Files are uploaded and shared
   - Progress is tracked via milestones and notes

## 5. External Dependencies

### Frontend Dependencies

- **UI & Styling**: Radix UI, Tailwind CSS, shadcn/ui components
- **State Management**: Tanstack React Query
- **Routing**: Wouter
- **Data Fetching**: Axios
- **Animation**: Framer Motion
- **Internationalization**: i18next
- **Form Handling**: React Hook Form with Zod validation

### Backend Dependencies

- **Database**: PostgreSQL via Neon serverless (@neondatabase/serverless)
- **ORM**: Drizzle ORM
- **File Upload**: Multer
- **AI Integration**: OpenAI API
- **WebSockets**: ws (for Neon database connection)

### External Services

- **Database**: Neon PostgreSQL (serverless)
- **AI Services**: OpenAI API for AI-powered features
- **External Service Catalog**: Integration with another service catalog system

## 6. Deployment Strategy

The application is configured for deployment on Replit with automatic scaling:

- **Build Process**: Vite for frontend, esbuild for backend
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 16 via Neon's serverless offering
- **Deployment Target**: Auto-scaling configuration
- **CI/CD**: Configured for Replit's deployment workflow
- **Development Environment**: Configured with hot-reloading and error overlays

### Environment Configuration:

- Development mode with specific configurations
- Production build process that compiles both frontend and backend
- Environment variables for API keys and database connections
- Static file serving for the built frontend assets

### Scalability Considerations:

- Serverless PostgreSQL through Neon for database scalability
- Stateless API design for horizontal scaling
- Cloud-based file storage options (Firebase Storage)