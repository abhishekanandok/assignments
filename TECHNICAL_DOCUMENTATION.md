# Technical Documentation

## AI Assignment Evaluator System Architecture

### Document Information
- **Version**: 1.0
- **Date**: May 2026
- **Author**: Abhishek Anand
- **Status**: Technical Documentation for Review

---

## 1. System Overview

### 1.1 Purpose
The AI Assignment Evaluator is an intelligent system that automates the evaluation of student assignments using AI/ML techniques, with a built-in teacher approval workflow to ensure result accuracy and integrity.

### 1.2 Architecture Pattern
- **Frontend**: Single Page Application (SPA) with Server-Side Rendering (SSR) support
- **Backend**: RESTful API with MVC pattern
- **Database**: Document-oriented NoSQL (MongoDB)
- **File Storage**: Cloud-based CDN (Cloudinary)
- **AI Engine**: OpenAI GPT with custom RAG implementation

---

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.5 | React framework with App Router, SSR/SSG support |
| React | 18.x | UI component library |
| Tailwind CSS | 3.4.x | Utility-first CSS framework |
| shadcn/ui | Latest | Headless UI component library |
| Radix UI | 1.1.x | Accessible UI primitives |
| Lucide React | 0.400 | Icon library |
| Recharts | 2.12.x | Data visualization |
| jsPDF | 4.2.x | PDF generation |
| Framer Motion | 11.18.x | Animation library |

### 2.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.19.x | Web framework |
| MongoDB | 6.x | Document database |
| Mongoose | 8.5.x | ODM for MongoDB |
| JWT | 9.0.x | Authentication tokens |
| Multer | 1.4.x | File upload handling |
| Cloudinary | 1.41.x | Cloud file storage |
| bcryptjs | 3.0.x | Password hashing |
| Morgan | 1.10.x | HTTP request logging |

### 2.3 AI/ML & NLP Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| OpenAI API | GPT-4 | AI evaluation engine |
| Natural | 6.12.x | NLP library (tokenization, stemming, TF-IDF) |
| Compromise | 14.13.x | Named Entity Recognition (NER) |
| TensorFlow.js | 4.20.x | Neural network layers |
| PDF-Parse | 1.1.x | PDF text extraction |
| Mammoth | 1.8.x | DOCX text extraction |

---

## 3. Core System Components

### 3.1 Authentication & Authorization Module

**JWT-Based Authentication Flow:**
```
1. User Login → Credentials
2. Server validates → Returns JWT token
3. Client stores token (localStorage)
4. Subsequent requests include token in Authorization header
5. Server verifies token → Grants access
```

**Role-Based Access Control (RBAC):**
- **Student Role**: Can submit assignments, view own history, see approved results
- **Teacher Role**: Can create sessions, review all submissions, approve/reject results, publish to students

### 3.2 File Upload & Storage System

**Architecture:**
```
Client Upload → Multer (multipart parsing) → Cloudinary CDN → URL Storage in MongoDB
```

**Supported Formats:**
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Images (.jpg, .jpeg, .png)

**Security Measures:**
- File type validation
- Size limits (10MB max)
- Cloudinary secure URLs
- MongoDB references to file URLs

### 3.3 AI Evaluation Pipeline

#### 3.3.1 RAG (Retrieval-Augmented Generation) Implementation

**What is RAG?**
RAG combines information retrieval with text generation. The system retrieves relevant context from a knowledge base (question paper, rubric) and augments the AI prompt with this context for more accurate evaluation.

**RAG Workflow:**
```
1. Query (Student Answer + Question Paper + Rubric)
       ↓
2. Retrieval (Extract key criteria from rubric)
       ↓
3. Context Augmentation (Build structured prompt with rubric criteria)
       ↓
4. Generation (OpenAI evaluates based on augmented context)
       ↓
5. Post-Processing (Parse AI response into structured result)
```

**RAG Benefits:**
- **Context-Aware Evaluation**: AI understands specific assignment requirements
- **Reduced Hallucinations**: Grounded in actual rubric criteria
- **Consistent Grading**: Same criteria applied to all submissions
- **Explainable Results**: Scores mapped to specific rubric parameters

#### 3.3.2 Evaluation Pipeline Steps

**Step 1: Text Extraction**
```javascript
// PDF extraction using pdf-parse
// DOCX extraction using mammoth
// OCR for image files (simulated)
```

**Step 2: Text Preprocessing**
```javascript
// Natural library pipeline:
// 1. Tokenization (WordTokenizer)
// 2. Stop word removal
// 3. Stemming (Porter Stemmer)
// 4. Named Entity Recognition (Compromise)
```

**Step 3: Feature Extraction (TF-IDF)**
```javascript
// Term Frequency-Inverse Document Frequency
// Converts text to numerical vectors
// Dimension: Up to 4096 features
```

**Step 4: Similarity Calculation**
```javascript
// Cosine Similarity between student answer and reference
// Formula: cos(θ) = (A · B) / (||A|| ||B||)
```

**Step 5: AI Scoring with RAG**
```javascript
// OpenAI GPT-4 with structured prompt:
// - System context: Evaluation criteria from rubric
// - User content: Student answer + question
// - Expected output: JSON with scores, feedback, grade
```

### 3.4 Teacher Approval Workflow

**State Machine:**
```
[Submitted] → [AI Evaluated] → [Pending Teacher Review] → [Approved/Published] OR [Rejected]
```

**Database Fields:**
- `teacherApproved`: Boolean - Has teacher approved?
- `publishedToStudent`: Boolean - Is result visible to student?
- `teacherModifiedResult`: Object - Teacher's modified scores (optional)
- `teacherFeedback`: String - Comments for student
- `approvedAt`: Date - Approval timestamp

**API Flow:**
1. Student submits → `teacherApproved: false`, `publishedToStudent: false`
2. Teacher reviews → `GET /api/faculty/submission/:id`
3. Teacher approves → `POST /api/faculty/submission/:id/review` with `action: "approve"`
4. Result published → `publishedToStudent: true`
5. Student views → `GET /api/student/submission/:id` returns full result

---

## 4. Database Schema Design

### 4.1 User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['student', 'teacher']),
  createdAt: Date
}
```

### 4.2 Session Collection
```javascript
{
  _id: ObjectId,
  sessionId: String (unique, 8-char alphanumeric),
  title: String,
  questionPaper: String (Cloudinary URL),
  rubric: String (Cloudinary URL),
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

### 4.3 Submission Collection
```javascript
{
  _id: ObjectId,
  sessionId: String (ref: Session),
  studentId: ObjectId (ref: User),
  studentName: String,
  assignmentPath: String (Cloudinary URL),
  assignmentText: String (extracted text),
  result: {
    totalMarks: Number,
    maxMarks: Number,
    percentage: Number,
    grade: String,
    similarityRisk: String,
    aiComment: String,
    scores: [{ parameter: String, score: Number, maxScore: Number, feedback: String }],
    improvements: [String],
    strengths: [String]
  },
  // Teacher Approval Fields
  teacherApproved: Boolean (default: false),
  publishedToStudent: Boolean (default: false),
  teacherModifiedResult: Object (same structure as result),
  teacherFeedback: String,
  approvedAt: Date,
  evaluatedAt: Date
}
```

---

## 5. API Documentation

### 5.1 Authentication Endpoints

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword",
  "role": "student"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "email": "...", "role": "..." }
}
```

#### POST /api/auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securepassword"
}
```

### 5.2 Student Endpoints

#### POST /api/student/evaluate
Submit assignment for AI evaluation.

**Headers:** `Authorization: Bearer <token>`
**Content-Type:** `multipart/form-data`

**Form Data:**
- `assignment`: File (PDF/DOCX/Image)
- `studentName`: String
- `sessionId`: String (optional)

**Response:**
```json
{
  "success": true,
  "result": { /* AI evaluation result */ },
  "submissionId": "..."
}
```

#### GET /api/student/my-submissions
Get student's submission history.

**Response:**
```json
{
  "success": true,
  "submissions": [
    {
      "_id": "...",
      "sessionId": "ABC12345",
      "publishedToStudent": true,
      "result": { /* Only if published */ }
    }
  ]
}
```

#### GET /api/student/submission/:submissionId
Get single submission details (only if published to student).

### 5.3 Faculty Endpoints

#### POST /api/faculty/create-session
Create new evaluation session.

**Request Body:**
```json
{
  "title": "Mid-Term Exam 2026",
  "questionsText": "Question paper content...",
  "rubricText": "Rubric content..."
}
```

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "ABC12345",
    "title": "Mid-Term Exam 2026"
  }
}
```

#### GET /api/faculty/submission/:submissionId
Get submission details for teacher review.

#### POST /api/faculty/submission/:submissionId/review
Approve or reject submission.

**Request Body:**
```json
{
  "action": "approve", // or "reject"
  "modifiedResult": { /* Optional: teacher modified scores */ },
  "teacherFeedback": "Good work, but could improve..."
}
```

#### POST /api/faculty/session/:sessionId/publish
Publish all approved results to students.

---

## 6. Security Implementation

### 6.1 Authentication Security
- **JWT Tokens**: HS256 algorithm, 24h expiration
- **Password Hashing**: bcryptjs with salt rounds 10
- **Token Storage**: Client-side localStorage with httpOnly consideration

### 6.2 Authorization Security
- **Middleware**: `authMiddleware` validates JWT
- **Role Restriction**: `restrictTo()` middleware enforces role-based access
- **Ownership Verification**: Controllers verify user owns the resource

### 6.3 Input Validation
- **File Uploads**: Multer with size limits (10MB), type filtering
- **Rate Limiting**: express-rate-limit (100 requests per 15 minutes)
- **CORS**: Configured for specific origins

### 6.4 Data Security
- **Database**: MongoDB with TLS/SSL
- **File Storage**: Cloudinary with signed URLs
- **Environment Variables**: dotenv for secrets

---

## 7. Performance Considerations

### 7.1 Database Optimization
- **Indexing**: Compound indexes on frequently queried fields
- **Selective Queries**: Using `.select()` to limit returned fields
- **Pagination**: Implemented for large result sets

### 7.2 Caching Strategy
- **Static Assets**: Cloudinary CDN caching
- **API Responses**: Client-side React Query/SWR (potential)

### 7.3 AI Optimization
- **Async Processing**: Non-blocking evaluation pipeline
- **Timeout Handling**: 60-second timeout for AI API calls
- **Error Fallback**: Demo mode when API unavailable

---

## 8. Deployment Guide

### 8.1 Environment Setup

**Production Environment Variables:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/ai-evaluator
JWT_SECRET=strong-random-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=api-key
CLOUDINARY_API_SECRET=api-secret
OPENAI_API_KEY=sk-prod-key
```

### 8.2 Deployment Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Client (Vercel)│────→│   API Server    │────→│   MongoDB Atlas │
│   Next.js App    │     │   (Render/AWS)  │     │   Database      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ↓
                       ┌─────────────────┐
                       │   Cloudinary    │
                       │   File Storage  │
                       └─────────────────┘
```

### 8.3 Recommended Hosting
- **Frontend**: Vercel (optimal for Next.js)
- **Backend**: Render, Railway, or AWS EC2
- **Database**: MongoDB Atlas (M0 free tier or M10+ for production)
- **File Storage**: Cloudinary (free tier sufficient for demo)

---

## 9. Future Enhancements

### 9.1 Technical Improvements
- **Redis Caching**: For frequently accessed submissions
- **Queue System**: Bull/Redis for handling multiple evaluations
- **Real-time Updates**: WebSockets for live result notifications
- **OCR Enhancement**: Tesseract.js integration for image text extraction
- **Plagiarism Detection**: Integrate with Turnitin API

### 9.2 Feature Additions
- **Bulk Upload**: Multiple assignment submissions
- **Analytics Dashboard**: Teacher insights on class performance
- **Mobile App**: React Native companion app
- **Offline Mode**: PWA with service workers

---

## 10. Troubleshooting

### Common Issues

**Issue**: "Module not found" errors
**Solution**: Run `npm install` in both frontend and backend directories

**Issue**: CORS errors
**Solution**: Verify `CORS_ORIGIN` env var matches your frontend URL

**Issue**: AI evaluation fails
**Solution**: Check OpenAI API key validity and quota

**Issue**: File upload fails
**Solution**: Verify Cloudinary credentials and file size limits

---

## 11. References

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [RAG Architecture Patterns](https://www.promptingguide.ai/techniques/rag)

---

## 12. Contact & Support

**Developer**: Abhishek Anand  
**GitHub**: [abhishekanandok](https://github.com/abhishekanandok)  
**Project Repository**: https://github.com/abhishekanandok/assignments

---

*This technical documentation is for educational and review purposes.*
