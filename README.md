# Nexora AI

> A modern full-stack AI workspace built for intelligent conversations, persistent chat history, authentication, subscription management, and AI-powered assistance.

Nexora AI is a full-stack AI chatbot and workspace application designed with a modern SaaS architecture. It combines a responsive Next.js frontend with a Node.js/Express backend, MongoDB persistence, JWT authentication, Gemini-powered AI responses, conversation management, and a manual payment verification system for Pro subscriptions.

The project is structured to provide a strong foundation for future capabilities such as streaming responses, document analysis, web search, AI tools, voice interaction, RAG, agents, and multimodal workflows.

---

## Overview

Nexora AI is more than a basic chatbot interface.

The application is designed around a **workspace-based AI experience** where users can:

* Create and continue conversations
* Persist conversations in MongoDB
* Authenticate securely with JWT
* Use a Free plan with a defined message limit
* Upgrade to Nexora Pro
* Submit payment transaction details
* Allow an administrator to manually verify payments
* Receive a 30-day Pro subscription after successful verification
* Use a modern responsive AI workspace interface
* Select files through the chat composer for future AI file-processing capabilities

The architecture separates the frontend presentation layer, backend API layer, business logic, database models, and AI service integration.

---

# Key Features

## AI Chat

* Gemini-powered conversational AI
* Multi-turn conversation context
* Persistent conversations
* New conversation creation
* Existing conversation retrieval
* Conversation deletion
* Loading and error states
* AI response handling
* Authentication-aware chat requests

## Authentication

* User registration
* User login
* JWT-based authentication
* Protected API routes
* Authenticated user retrieval
* Token validation middleware
* Automatic handling of expired/invalid authentication

## Conversation Management

Users can:

* Start a new chat
* Continue previous conversations
* View conversation history
* Open individual conversations
* Delete conversations
* Persist messages between sessions

Each conversation belongs to a specific authenticated user.

## Free & Pro Plans

Nexora AI currently uses a two-tier subscription model.

### Free

* 15 lifetime successful AI messages
* Access to the core chatbot
* Conversation persistence
* Upgrade option after reaching the limit

### Pro

* Rs. 999
* 30-day subscription
* Unlimited AI messages while the subscription is active
* No message counting for Pro users

Expired Pro subscriptions are automatically downgraded to the Free plan.

---

# Payment System

Nexora AI includes a manual payment verification workflow designed for the current MVP.

Supported providers:

* Easypaisa
* Payoneer

### Payment Flow

```text
User
  │
  ▼
Select Pro Plan
  │
  ▼
Create Payment
  │
  ▼
Payment stored as "pending"
  │
  ▼
User completes payment externally
  │
  ▼
User submits transaction/reference ID
  │
  ▼
Admin reviews payment
  │
  ▼
Admin enters actual received amount
  │
  ├── < Rs. 999 ──► Reject
  │
  └── >= Rs. 999 ─► Verify
                       │
                       ▼
                 Pro Activated
                       │
                       ▼
                  30-day access
```

The minimum payment requirement is enforced on the backend as well as the frontend.

This is important because frontend validation alone cannot be trusted for payment authorization.

> The current system uses manual verification. It does not claim automatic verification from Easypaisa or Payoneer.

---

# System Architecture

```text
                         ┌───────────────────────┐
                         │       User            │
                         │   Browser / Mobile    │
                         └───────────┬───────────┘
                                     │
                                     ▼
                    ┌────────────────────────────┐
                    │       Next.js Frontend     │
                    │                            │
                    │  ┌──────────────────────┐  │
                    │  │ Authentication UI     │  │
                    │  ├──────────────────────┤  │
                    │  │ Chat Workspace        │  │
                    │  ├──────────────────────┤  │
                    │  │ Conversation History  │  │
                    │  ├──────────────────────┤  │
                    │  │ Profile / Pricing     │  │
                    │  ├──────────────────────┤  │
                    │  │ Upgrade / Payments    │  │
                    │  └──────────────────────┘  │
                    └─────────────┬──────────────┘
                                  │
                         HTTP / REST API
                                  │
                                  ▼
                    ┌────────────────────────────┐
                    │     Express Backend        │
                    │                            │
                    │  ┌──────────────────────┐  │
                    │  │ Authentication       │  │
                    │  ├──────────────────────┤  │
                    │  │ Chat Controller      │  │
                    │  ├──────────────────────┤  │
                    │  │ Payment Controller   │  │
                    │  ├──────────────────────┤  │
                    │  │ Auth Middleware      │  │
                    │  └──────────────────────┘  │
                    └───────┬───────────┬────────┘
                            │           │
                 ┌──────────┘           └──────────┐
                 ▼                                 ▼
       ┌────────────────────┐             ┌──────────────────┐
       │      MongoDB       │             │   Gemini API     │
       │                    │             │                  │
       │ Users              │             │ AI Responses     │
       │ Conversations      │             │ Chat Context     │
       │ Payments           │             │                  │
       └────────────────────┘             └──────────────────┘
```

---

# Frontend Architecture

The frontend is built using **Next.js** with a component-driven architecture.

```text
frontend/
│
├── app/
│   ├── admin/
│   │   └── payments/
│   │       └── page.tsx
│   │
│   ├── chat/
│   │   └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── pricing/
│   │   └── page.tsx
│   │
│   ├── profile/
│   │   └── page.tsx
│   │
│   └── upgrade/
│       └── page.tsx
│
├── components/
│   ├── ChatSidebar.tsx
│   ├── ChatHeader.tsx
│   ├── WelcomeScreen.tsx
│   ├── MessageList.tsx
│   └── ChatComposer.tsx
│
└── lib/
    └── api/
        ├── auth.ts
        └── chat.ts
```

## Frontend Responsibilities

The frontend is responsible for:

* Rendering the application UI
* Managing local UI state
* Handling authentication state
* Sending API requests
* Displaying conversations
* Managing the active conversation
* Handling loading states
* Handling API errors
* Displaying subscription information
* Managing the payment submission interface
* Providing responsive layouts

The frontend does **not** make the final decision about authentication, subscription access, or payment validity.

Those decisions are handled by the backend.

---

# Chat Workspace Architecture

The main chat page acts as the orchestration layer for the chat experience.

```text
ChatPage
   │
   ├── ChatSidebar
   │      ├── New Chat
   │      ├── Conversation History
   │      └── Delete Conversation
   │
   ├── ChatHeader
   │
   ├── WelcomeScreen
   │      └── Suggested Prompts
   │
   ├── MessageList
   │      └── User / Assistant Messages
   │
   └── ChatComposer
          ├── Text Input
          ├── File Picker
          ├── AI Tools
          └── Send
```

The `ChatPage` manages the primary chat state:

* Current user
* Conversations
* Active conversation
* Messages
* Input
* Loading state
* Free-plan limit state
* Mobile sidebar state

This keeps the major application workflow centralized while the UI itself remains componentized.

---

# Chat Request Lifecycle

When a user sends a message:

```text
User enters message
        │
        ▼
ChatComposer
        │
        ▼
ChatPage.handleSend()
        │
        ▼
sendChatMessage()
        │
        ▼
POST /api/chat
        │
        ▼
JWT Authentication Middleware
        │
        ▼
Chat Controller
        │
        ├── Validate user
        │
        ├── Check subscription
        │
        ├── Check Free limit
        │
        ├── Build conversation context
        │
        ▼
Gemini Service
        │
        ▼
Gemini Model
        │
        ▼
AI Response
        │
        ▼
Conversation saved in MongoDB
        │
        ▼
Response returned to frontend
        │
        ▼
MessageList updated
```

This separation allows the AI provider to be changed later without rewriting the entire frontend.

---

# Backend Architecture

The backend follows a layered Express architecture.

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── chat.controller.js
│   └── payment.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── error.middleware.js
│
├── models/
│   ├── User.js
│   ├── Conversation.js
│   └── Payment.js
│
├── routes/
│   ├── auth.routes.js
│   ├── chat.routes.js
│   └── payment.routes.js
│
├── services/
│   └── gemini.service.js
│
├── server.js
├── .env
├── .gitignore
└── package.json
```

---

# Backend Layers

## Routes

Routes define the public API endpoints and connect requests to controllers.

```text
/api/auth
/api/chat
/api/payment
```

Protected routes use the authentication middleware.

---

## Middleware

### Authentication Middleware

The authentication middleware:

1. Reads the `Authorization` header
2. Extracts the Bearer token
3. Verifies the JWT
4. Extracts the authenticated user ID
5. Attaches the user information to `req.user`

This ensures that protected resources are associated with the authenticated account.

### Error Middleware

The centralized error middleware provides a consistent API error structure and prevents individual controllers from having to format every server error differently.

---

# Controllers

Controllers contain the application's business logic.

### Auth Controller

Responsible for:

* Registration
* Login
* Current user retrieval
* Subscription expiration handling
* User plan information

### Chat Controller

Responsible for:

* Sending AI messages
* Conversation creation
* Conversation retrieval
* Conversation listing
* Conversation deletion
* Free-plan limits
* Pro subscription access

### Payment Controller

Responsible for:

* Creating payment records
* Receiving transaction IDs
* Fetching pending payments
* Manual payment verification
* Activating Pro subscriptions
* Payment history

---

# Service Layer

The Gemini integration is isolated inside:

```text
services/gemini.service.js
```

This abstraction prevents the controllers from being tightly coupled to the AI provider.

The service receives conversation messages, builds the required Gemini chat context, sends the latest message to the model, and returns the generated response.

This architecture makes it easier to introduce another model provider in the future.

---

# Database Architecture

MongoDB is used as the primary database through Mongoose.

The application currently uses three core collections.

```text
MongoDB
│
├── users
│
├── conversations
│
└── payments
```

## User

Stores:

* Name
* Email
* Password hash
* Subscription plan
* Message usage
* Subscription status
* Subscription start date
* Subscription end date
* Timestamps

Important subscription fields:

```text
plan
messageCount
subscriptionStatus
subscriptionStart
subscriptionEnd
```

---

## Conversation

A conversation belongs to one authenticated user.

```text
Conversation
│
├── user
├── title
├── messages[]
│     ├── role
│     ├── content
│     └── timestamps
│
└── timestamps
```

Message roles are restricted to:

```text
user
assistant
```

This creates a persistent conversation structure instead of treating every AI request as an isolated prompt.

---

## Payment

Payment records contain:

* User
* Plan
* Expected amount
* Actual received amount
* Currency
* Payment provider
* Transaction/reference ID
* Payment status
* Payment timestamp
* Created/updated timestamps

Payment states:

```text
pending
paid
failed
cancelled
```

---

# Subscription Logic

The subscription system is intentionally enforced on the server.

## Free User

```text
messageCount < 15
        │
        ▼
     Allowed
        │
        ▼
Successful AI response
        │
        ▼
messageCount + 1
```

Once the user reaches 15 successful messages:

```text
messageCount >= 15
        │
        ▼
Chat locked
        │
        ▼
Upgrade to Pro
```

## Pro User

```text
Pro + active subscription
        │
        ▼
Unlimited AI messages
```

Pro messages are not counted against the Free message counter.

## Expired Pro

When the subscription expires:

```text
Pro
 │
 ▼
Subscription End < Current Time
 │
 ▼
Downgrade to Free
 │
 ▼
Free message rules apply
```

This prevents expired subscriptions from retaining Pro access indefinitely.

---

# API Structure

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Chat

```text
POST   /api/chat
GET    /api/chat
GET    /api/chat/:conversationId
DELETE /api/chat/:conversationId
```

## Payments

```text
POST /api/payment/create
POST /api/payment/submit-transaction
GET  /api/payment/history

GET  /api/payment/admin/pending
POST /api/payment/verify
```

The payment verification endpoints are protected using authentication plus the current MVP admin payment secret mechanism.

---

# Security Architecture

Nexora AI uses multiple layers of protection.

### JWT Authentication

Protected endpoints require a valid Bearer token.

### User Ownership

Conversation and payment queries are scoped to the authenticated user where applicable.

### Backend Subscription Validation

The backend, rather than the frontend, decides whether a user can access Pro functionality.

### Server-side Payment Validation

The backend validates the actual received amount before activating Pro.

```text
receivedAmount < 999
        │
        ▼
     Reject
```

### Environment Variables

Sensitive configuration such as:

* Gemini API key
* MongoDB connection string
* JWT secret
* Admin payment secret

is stored outside the source code through environment variables.

---

# UI / UX Architecture

Nexora AI follows a premium dark-first SaaS design system.

### Visual Direction

* Dark workspace
* Glass-inspired surfaces
* Subtle borders
* Cyan / blue / violet accents
* Soft gradients
* Minimal visual noise
* Compact navigation
* Responsive layouts
* Focused AI workspace experience

Core background:

```text
#070A0F
```

Primary surfaces use darker layered tones such as:

```text
#0D1117
#111827
```

The UI avoids unnecessary visual complexity while maintaining a premium AI-product feel.

---

# Responsive Design

The interface is designed for both desktop and mobile.

### Desktop

```text
┌──────────────┬───────────────────────────────┐
│              │ Header                        │
│   Sidebar    ├───────────────────────────────┤
│              │                               │
│ Conversations│        Messages               │
│              │                               │
│              ├───────────────────────────────┤
│              │ Composer                      │
└──────────────┴───────────────────────────────┘
```

### Mobile

The sidebar becomes a drawer while the main workspace uses the full available width.

The composer and controls adapt to smaller screens without sacrificing the primary chat workflow.

---

# File Attachment Architecture

The chat composer currently includes a functional file picker.

Supported file selection includes common development and document formats such as:

```text
PDF
TXT
DOC
DOCX
CSV
JSON
JS
JSX
TS
TSX
HTML
CSS
PY
MD
```

Current implementation:

```text
Paperclip
   │
   ▼
Hidden <input type="file">
   │
   ▼
Selected File
   │
   ▼
File Preview
   │
   ▼
Remove / Replace
```

The current MVP handles file selection on the frontend.

The selected file is **not yet processed by the Gemini backend**. This separation intentionally leaves the architecture ready for a future document-processing pipeline.

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide React

## Backend

* Node.js
* Express.js
* JavaScript
* JWT
* Mongoose

## Database

* MongoDB

## AI

* Google Gemini API

## Authentication

* JSON Web Tokens
* Protected Express middleware

## Payments

* Easypaisa
* Payoneer
* Manual transaction verification

---

# Project Complexity

Nexora AI is intentionally structured beyond a basic CRUD chatbot.

The application combines several independent systems:

```text
Authentication
      │
      ├── JWT
      │
      ▼
User Management
      │
      ├── Free Plan
      ├── Pro Plan
      └── Subscription Expiration
      │
      ▼
Chat System
      │
      ├── Conversations
      ├── Messages
      └── Gemini Context
      │
      ▼
Payment System
      │
      ├── Payment Creation
      ├── Transaction Submission
      ├── Admin Verification
      └── Subscription Activation
      │
      ▼
Persistent Database
      │
      ├── Users
      ├── Conversations
      └── Payments
```

This creates a foundation for evolving the application into a larger AI SaaS platform.

---

# Future Architecture

The current architecture is designed to accommodate additional AI capabilities without replacing the existing core.

Planned expansion areas include:

## Streaming AI

```text
Client
  │
  ▼
API
  │
  ▼
AI Service
  │
  ▼
Streaming Response
  │
  ▼
Live UI Updates
```

## Document Intelligence

```text
File Upload
    │
    ▼
File Validation
    │
    ▼
Text Extraction
    │
    ▼
Chunking
    │
    ▼
Embeddings
    │
    ▼
Vector Database
    │
    ▼
RAG
    │
    ▼
Gemini
```

## AI Tools

Potential tools include:

* Web search
* Deep research
* Code generation
* Code analysis
* Image generation
* Document analysis
* Voice interaction
* AI agents

## Advanced AI Architecture

Future versions can evolve toward:

```text
                    Nexora AI
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
   Chat Engine      Tool Engine      Agent Engine
        │               │                │
        ▼               ▼                ▼
     Gemini         Web Search          RAG
                    Code Tools          Memory
                    Files               Planning
                    APIs                Execution
```

---

# Environment Variables

Create a `.env` file inside the backend:

```env
PORT=5000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
ADMIN_PAYMENT_SECRET=YOUR_ADMIN_PAYMENT_SECRET
```

Frontend environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Never commit real API keys, database credentials, JWT secrets, or admin secrets to GitHub.

---

# Local Development

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd "AI-chatbot Application"
```

## 2. Install backend dependencies

```bash
cd backend
npm install
```

## 3. Configure backend environment

Create:

```text
backend/.env
```

and add the required environment variables.

## 4. Start backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

## 5. Install frontend dependencies

Open another terminal:

```bash
cd frontend
npm install
```

## 6. Configure frontend environment

Create:

```text
frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 7. Start frontend

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

# Production Considerations

Before deploying Nexora AI as a public SaaS product, several areas should be strengthened.

### Payments

Replace the MVP manual verification flow with official provider integrations where available.

### Admin Security

Replace the static admin payment secret with proper role-based admin authentication.

### API Security

Add:

* Rate limiting
* Request validation
* Stronger CORS configuration
* Security headers
* Abuse prevention
* Request logging

### AI Reliability

Add:

* Streaming
* Retry handling
* Provider fallback
* Usage tracking
* Token/cost monitoring
* AI request limits

### File Processing

Add:

* Secure uploads
* File-size limits
* MIME validation
* Virus/malware scanning
* Text extraction
* Storage
* Document indexing
* RAG pipeline

---

# Architecture Principles

Nexora AI follows several important engineering principles:

### Separation of Concerns

Frontend, routes, controllers, services, middleware, and database models have distinct responsibilities.

### Backend as the Source of Truth

Authentication, subscription status, message limits, and payment validation are enforced server-side.

### Provider Abstraction

Gemini integration is isolated inside a service layer so the AI provider can evolve independently.

### Persistent State

Conversations and user data are stored in MongoDB rather than relying exclusively on browser state.

### Extensibility

The current architecture is designed so future AI tools and capabilities can be added without rebuilding the entire application.

---

# Current Status

### Completed

* [x] Next.js AI workspace
* [x] Responsive chat interface
* [x] Authentication
* [x] JWT protection
* [x] MongoDB integration
* [x] Gemini integration
* [x] Persistent conversations
* [x] Conversation history
* [x] Conversation deletion
* [x] Free 15-message limit
* [x] Pro subscription logic
* [x] Subscription expiration handling
* [x] Easypaisa payment workflow
* [x] Payoneer payment workflow
* [x] Transaction ID submission
* [x] Admin payment dashboard
* [x] Server-side Rs.999 minimum payment validation
* [x] Payment history
* [x] Responsive mobile sidebar
* [x] File picker UI

### Future

* [ ] AI streaming
* [ ] Markdown rendering
* [ ] Code syntax highlighting
* [ ] Code copy actions
* [ ] File-to-AI processing
* [ ] Document analysis
* [ ] RAG
* [ ] Web search
* [ ] Deep research
* [ ] Voice interaction
* [ ] Image generation
* [ ] AI agents
* [ ] Projects / workspaces
* [ ] Production payment APIs
* [ ] Role-based admin system

---

# Why Nexora AI?

Nexora AI is built as a foundation for a broader AI SaaS ecosystem rather than as a single-purpose chatbot.

Its architecture already separates:

```text
UI
│
├── Application State
│
├── REST API
│
├── Authentication
│
├── Business Logic
│
├── AI Service
│
├── Subscription System
│
├── Payment System
│
└── Database
```

This makes the project easier to maintain, extend, debug, and scale as new AI capabilities are introduced.

---

# License

This project is currently intended as a personal/professional portfolio and SaaS development project.

Add an appropriate open-source license here if the repository is intended to be distributed publicly under one.
