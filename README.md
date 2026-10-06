# 🤖 Nexora AI

> **A modern full-stack AI workspace built for intelligent conversations, persistent chat history, authentication, subscriptions, and AI-powered assistance.**

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-24-339933?style=for-the-badge&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google" alt="Gemini AI" />
</p>

<p align="center">
  <a href="https://ai-chatbot-application-teal.vercel.app/">🌐 Live Application</a>
  •
  <a href="https://ai-chatbot-application-nam9.onrender.com">⚙️ Backend API</a>
</p>

---

## 📌 Overview

**Nexora AI** is a full-stack AI chatbot and workspace application designed with a modern SaaS architecture.

It combines:

* ⚡ Next.js frontend
* 🧠 Gemini-powered AI
* 🔐 JWT authentication
* 💾 MongoDB persistence
* 💬 Persistent conversations
* 💳 Free and Pro subscription system
* 💰 Manual payment verification
* 📱 Responsive AI workspace
* 📎 File selection interface
* 🛡️ Server-side authorization and validation

The architecture is designed to provide a strong foundation for future AI capabilities such as streaming responses, document intelligence, RAG, web search, voice interaction, AI tools, agents, and multimodal workflows.

---

## 🌐 Live Deployment

| Service  | Platform      | Status        |
| -------- | ------------- | ------------- |
| Frontend | Vercel        | 🟢 Live       |
| Backend  | Render        | 🟢 Live       |
| Database | MongoDB       | 🟢 Connected  |
| AI       | Google Gemini | 🟢 Integrated |

### 🔗 Links

**Frontend:**
https://ai-chatbot-application-teal.vercel.app/

**Backend:**
https://ai-chatbot-application-nam9.onrender.com

---

# ✨ Key Features

## 🧠 AI Chat

* Gemini-powered conversational AI
* Multi-turn conversation context
* Persistent conversations
* New conversation creation
* Existing conversation retrieval
* Conversation deletion
* Loading and error states
* Authentication-aware chat requests
* AI response handling

---

## 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected API routes
* Authenticated user retrieval
* JWT validation middleware
* Invalid/expired token handling

---

## 💬 Conversation Management

Users can:

* Create a new chat
* Continue previous conversations
* View conversation history
* Open individual conversations
* Delete conversations
* Persist messages between sessions

Every conversation is associated with its authenticated user.

---

# 💎 Free & Pro Plans

Nexora AI currently uses a two-tier subscription model.

### 🆓 Free

* 15 successful AI messages
* Core AI chatbot access
* Conversation persistence
* Upgrade option after reaching the limit

### 🚀 Pro

* **Rs. 999**
* **30-day subscription**
* Unlimited AI messages while active
* No Free-plan message counting

Expired Pro subscriptions automatically return to the Free plan.

---

# 💳 Payment System

Nexora AI includes a manual payment verification workflow for the current MVP.

### Supported Providers

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
Payment stored as Pending
  │
  ▼
User completes payment externally
  │
  ▼
Transaction ID submitted
  │
  ▼
Admin reviews payment
  │
  ▼
Admin enters received amount
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

The minimum payment requirement is validated on both the frontend and backend.

> **Note:** The current MVP uses manual payment verification. It does not claim automatic verification from Easypaisa or Payoneer.

---

# 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │        User          │
                         │   Browser / Mobile   │
                         └──────────┬───────────┘
                                    │
                                    ▼
                     ┌──────────────────────────┐
                     │      Next.js Frontend    │
                     │                          │
                     │  Authentication         │
                     │  Chat Workspace          │
                     │  Conversations           │
                     │  Profile / Pricing       │
                     │  Upgrade / Payments      │
                     └────────────┬─────────────┘
                                  │
                              REST API
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │     Express Backend      │
                     │                          │
                     │  Authentication          │
                     │  Chat Controller         │
                     │  Payment Controller      │
                     │  Middleware              │
                     └─────────┬───────┬────────┘
                               │       │
                    ┌──────────┘       └──────────┐
                    ▼                             ▼
           ┌─────────────────┐           ┌─────────────────┐
           │     MongoDB     │           │   Gemini API    │
           │                 │           │                 │
           │ Users           │           │ AI Responses    │
           │ Conversations   │           │ Chat Context    │
           │ Payments        │           │                 │
           └─────────────────┘           └─────────────────┘
```

---

# 🎨 Frontend Architecture

The frontend is built with **Next.js, React, TypeScript, Tailwind CSS, and Framer Motion**.

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

### Frontend Responsibilities

The frontend handles:

* UI rendering
* Local UI state
* Authentication state
* API requests
* Conversation display
* Active conversation management
* Loading states
* API error handling
* Subscription information
* Payment submission interface
* Responsive layouts

Critical authorization and subscription decisions remain on the backend.

---

# 💬 Chat Workspace

The main chat page acts as the orchestration layer for the AI workspace.

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
          ├── AI Controls
          └── Send
```

The `ChatPage` manages:

* Current user
* Conversations
* Active conversation
* Messages
* Input
* Loading state
* Free-plan limit state
* Mobile sidebar state

---

# 🔄 Chat Request Lifecycle

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
JWT Authentication
        │
        ▼
Chat Controller
        │
        ├── Validate User
        ├── Check Subscription
        ├── Check Free Limit
        └── Build Context
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
       Save to MongoDB
                │
                ▼
        Response to Client
                │
                ▼
        Update MessageList
```

The AI provider is isolated behind a service layer, making it easier to change or expand AI providers later.

---

# ⚙️ Backend Architecture

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

# 🧩 Backend Layers

## 🛣️ Routes

The API is organized into three main route groups:

```text
/api/auth
/api/chat
/api/payment
```

Protected endpoints use authentication middleware.

---

## 🛡️ Middleware

### Authentication Middleware

The middleware:

1. Reads the `Authorization` header
2. Extracts the Bearer token
3. Verifies the JWT
4. Extracts the authenticated user ID
5. Attaches user information to `req.user`

### Error Middleware

A centralized error handler provides consistent API error responses and keeps controllers cleaner.

---

# 🎯 Controllers

## Auth Controller

Responsible for:

* Registration
* Login
* Current user retrieval
* Subscription expiration handling
* User plan information

## Chat Controller

Responsible for:

* Sending AI messages
* Creating conversations
* Retrieving conversations
* Listing conversations
* Deleting conversations
* Free-plan limits
* Pro subscription access

## Payment Controller

Responsible for:

* Payment creation
* Transaction submission
* Pending payment retrieval
* Manual verification
* Pro activation
* Payment history

---

# 🧠 AI Service Layer

Gemini integration is isolated inside:

```text
services/gemini.service.js
```

The service:

* Receives conversation messages
* Builds Gemini conversation context
* Sends the latest message
* Returns the generated response

This keeps the controllers independent from the AI provider and makes future provider changes easier.

---

# 🗄️ Database Architecture

MongoDB is used as the primary database through Mongoose.

```text
MongoDB
│
├── users
├── conversations
└── payments
```

---

## 👤 User Model

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

Important fields:

```text
plan
messageCount
subscriptionStatus
subscriptionStart
subscriptionEnd
```

---

## 💬 Conversation Model

Each conversation belongs to one authenticated user.

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

Message roles:

```text
user
assistant
```

---

## 💰 Payment Model

Stores:

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

# 📊 Subscription Logic

## 🆓 Free User

```text
messageCount < 15
        │
        ▼
     Allowed
        │
        ▼
Successful AI Response
        │
        ▼
messageCount + 1
```

When the limit is reached:

```text
messageCount >= 15
        │
        ▼
     Chat Locked
        │
        ▼
   Upgrade to Pro
```

## 🚀 Pro User

```text
Active Pro Subscription
          │
          ▼
  Unlimited AI Messages
```

## ⏰ Expired Pro

```text
Pro Subscription
       │
       ▼
End Date < Current Time
       │
       ▼
Downgrade to Free
       │
       ▼
Free Plan Rules Apply
```

---

# 🔌 API Structure

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Chat

```http
POST   /api/chat
GET    /api/chat
GET    /api/chat/:conversationId
DELETE /api/chat/:conversationId
```

### Payments

```http
POST /api/payment/create
POST /api/payment/submit-transaction
GET  /api/payment/history

GET  /api/payment/admin/pending
POST /api/payment/verify
```

---

# 🔒 Security Architecture

Nexora AI applies multiple server-side security controls.

### JWT Authentication

Protected API endpoints require a valid Bearer token.

### User Ownership

User-specific conversations and payment records are scoped to the authenticated account.

### Backend Subscription Validation

Subscription access is decided by the backend rather than trusting the frontend.

### Server-side Payment Validation

The backend validates the actual received amount before activating Pro.

```text
receivedAmount < Rs.999
          │
          ▼
        Reject
```

### Environment Variables

Sensitive values are stored outside the source code:

* Gemini API key
* MongoDB connection string
* JWT secret
* Admin payment secret

---

# 🎨 UI / UX

Nexora AI follows a premium dark-first SaaS design direction.

### Design Principles

* 🌑 Dark workspace
* ✨ Glass-inspired surfaces
* 🔲 Subtle borders
* ⚡ Cyan / blue / violet accents
* 🌈 Controlled gradients
* 📐 Clean spacing
* 🧭 Compact navigation
* 📱 Responsive layouts
* 🎯 Focused AI workspace experience

Core background:

```text
#070A0F
```

Primary surfaces:

```text
#0D1117
#111827
```

The interface focuses on usability without unnecessary visual complexity.

---

# 📱 Responsive Design

### Desktop

```text
┌──────────────┬───────────────────────────────┐
│              │ Header                        │
│   Sidebar    ├───────────────────────────────┤
│              │                               │
│ Conversations│           Messages            │
│              │                               │
│              ├───────────────────────────────┤
│              │ Composer                      │
└──────────────┴───────────────────────────────┘
```

### Mobile

The sidebar becomes a drawer and the workspace adapts to the available screen width.

The composer and controls are optimized for smaller screens while preserving the core chat experience.

---

# 📎 File Attachment Architecture

The chat composer currently includes a frontend file picker.

Supported formats include:

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

Current flow:

```text
Paperclip
    │
    ▼
File Input
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

### Current MVP Status

The file picker works on the frontend, but the selected file is **not yet processed by Gemini**.

This architecture leaves the application ready for future document-processing and RAG capabilities.

---

# 🛠️ Technology Stack

| Category       | Technologies               |
| -------------- | -------------------------- |
| Frontend       | Next.js, React, TypeScript |
| Styling        | Tailwind CSS               |
| Animation      | Framer Motion              |
| Icons          | Lucide React               |
| Backend        | Node.js, Express.js        |
| Database       | MongoDB, Mongoose          |
| Authentication | JWT                        |
| AI             | Google Gemini API          |
| Payments       | Easypaisa, Payoneer        |
| Deployment     | Vercel, Render             |

---

# 📈 Project Complexity

Nexora AI combines multiple independent systems into one SaaS architecture:

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

---

# 🚀 Future Roadmap

## ⚡ AI Streaming

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

## 📄 Document Intelligence

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

## 🔎 AI Tools

Future capabilities may include:

* Web search
* Deep research
* Code generation
* Code analysis
* Image generation
* Document analysis
* Voice interaction
* AI agents

## 🧠 Advanced AI Architecture

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

# 🔧 Environment Variables

## Backend

Create:

```text
backend/.env
```

```env
PORT=5000
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
ADMIN_PAYMENT_SECRET=YOUR_ADMIN_PAYMENT_SECRET
```

## Frontend

Create:

```text
frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, set:

```env
NEXT_PUBLIC_API_URL=https://ai-chatbot-application-nam9.onrender.com
```

> Never commit API keys, database credentials, JWT secrets, or admin secrets to GitHub.

---

# 💻 Local Development

## 1. Clone Repository

```bash
git clone https://github.com/Abdullah-Asim-dev/AI-Chatbot-Application.git
cd "AI-chatbot Application"
```

## 2. Backend Setup

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

Add the required environment variables.

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# ☁️ Production Deployment

### Frontend

Deployed with:

**Vercel**

```text
https://ai-chatbot-application-teal.vercel.app/
```

### Backend

Deployed with:

**Render**

```text
https://ai-chatbot-application-nam9.onrender.com
```

### Production Architecture

```text
                 ┌─────────────────────┐
                 │      Vercel         │
                 │   Next.js Frontend  │
                 └──────────┬──────────┘
                            │
                            │ HTTPS
                            ▼
                 ┌─────────────────────┐
                 │       Render        │
                 │ Node + Express API  │
                 └───────┬───────┬─────┘
                         │       │
                         ▼       ▼
                  ┌──────────┐  ┌─────────────┐
                  │ MongoDB  │  │ Gemini API  │
                  └──────────┘  └─────────────┘
```

---

# 🛡️ Production Considerations

Before operating Nexora AI as a large public SaaS platform, the following areas should be strengthened.

### Payments

Replace the MVP manual verification workflow with official payment-provider integrations where available.

### Admin Security

Replace the static admin payment secret with role-based admin authentication.

### API Security

Add:

* Rate limiting
* Request validation
* Security headers
* Abuse prevention
* Request logging
* Production CORS configuration

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
* Malware scanning
* Text extraction
* File storage
* Document indexing
* RAG pipeline

---

# 🧱 Architecture Principles

### Separation of Concerns

Frontend, routes, controllers, services, middleware, and database models have separate responsibilities.

### Backend as the Source of Truth

Authentication, subscription status, message limits, and payment validation are enforced server-side.

### Provider Abstraction

Gemini integration is isolated inside a service layer.

### Persistent State

Users, conversations, and payments are persisted in MongoDB.

### Extensibility

The architecture is designed so future AI tools and services can be added without rebuilding the entire application.

---

# ✅ Current Status

### Completed

* [x] Next.js AI workspace
* [x] Responsive chat interface
* [x] User registration
* [x] User login
* [x] JWT authentication
* [x] MongoDB integration
* [x] Gemini AI integration
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
* [x] Server-side Rs.999 payment validation
* [x] Payment history
* [x] Responsive mobile sidebar
* [x] File picker UI
* [x] Production frontend deployment
* [x] Production backend deployment

### 🔮 Future

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

# 🎯 Why Nexora AI?

Nexora AI is designed as a foundation for a broader AI SaaS ecosystem rather than a simple chatbot.

The architecture separates:

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

This makes the project easier to maintain, extend, debug, and evolve as new AI capabilities are introduced.

---

# 📄 License

This project is currently intended as a personal/professional portfolio and SaaS development project.

Add an appropriate open-source license if the repository is later intended for public distribution under specific licensing terms.

---

## 👨‍💻 Developed By

<p align="center">
  <strong>Abdullah Asim</strong>
  <br />
  Full-Stack Developer
  <br /><br />
  <a href="https://github.com/Abdullah-Asim-dev">GitHub</a>
  •
  <a href="https://www.linkedin.com/in/abdullah-asim-dev/">LinkedIn</a>
</p>

<p align="center">
  ⭐ If you find Nexora AI interesting, consider giving the repository a star.
</p>
