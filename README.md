# AI Assignment Evaluator

An intelligent assignment evaluation system that uses AI/ML techniques to automatically assess student submissions, with teacher approval workflow for result validation.

![Assignment Evaluator Workflow](./workflow-diagram.png)

## 🚀 Features

### Student Features
- **Assignment Upload**: Submit assignments in PDF, DOC, DOCX, or image formats
- **AI Evaluation**: Automatic grading using AI with detailed feedback
- **Result Tracking**: View submission history and scores
- **Teacher Approval**: Results are reviewed by teachers before publication
- **Detailed Feedback**: View scores, strengths, improvements, and similarity analysis

### Teacher/Faculty Features
- **Session Management**: Create and manage evaluation sessions
- **Question Paper Upload**: Upload question papers and rubrics
- **Student Submissions**: View all submissions per session
- **Teacher Review Workflow**:
  - Review AI-generated results
  - Modify scores if needed
  - Approve or reject submissions
  - Add feedback comments
- **Bulk Publishing**: Publish all approved results to students at once
- **Document View**: View/download student submitted documents

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **Recharts** - Data visualization for performance charts
- **Lucide React** - Icon library
- **jsPDF** - PDF report generation

### Backend
- **Node.js & Express** - REST API server
- **MongoDB & Mongoose** - Database & ODM
- **Cloudinary** - File storage (PDFs, images)
- **JWT** - Authentication & authorization
- **Multer** - File upload handling
- **OpenAI API** - AI evaluation engine

### AI/ML Pipeline (Demonstration)
- **Natural** - Text preprocessing (stop words, stemming)
- **Compromise** - Named Entity Recognition
- **TF-IDF** - Feature extraction & vectorization
- **Cosine Similarity** - Semantic comparison
- **TensorFlow.js** - Neural network scoring layers

## 📋 Prerequisites

- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for file storage)
- OpenAI API key

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/abhishekanandok/assignments.git
cd assignments
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-evaluator
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENAI_API_KEY=sk-your-openai-key
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start frontend dev server:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Submit assignments, view approved results, track history |
| **Teacher** | Create sessions, review submissions, approve/reject results, publish to students |

## 🔄 Workflow

### Student Workflow
1. Login as student
2. Select or enter session ID
3. Upload assignment file (PDF/DOC/Image)
4. Wait for AI evaluation
5. View result after teacher approval

### Teacher Workflow
1. Login as teacher
2. Create evaluation session with question paper and rubric
3. View student submissions
4. Review AI-generated results
5. Modify scores if needed
6. Approve and publish results to students

## 📊 AI Evaluation Pipeline

The system demonstrates a complete ML/NLP pipeline:

```
1. Upload Assignment → 2. File Storage (Cloudinary)
     ↓
3. Text Extraction (OCR/Parser)
     ↓
4. Preprocessing (stop words, punctuation, normalization)
     ↓
5. Feature Extraction (TF-IDF Vectorization)
     ↓
6. Similarity Calculation (Cosine Similarity)
     ↓
7. AI-Based Evaluation (OpenAI API + ML Scoring)
     ↓
8. Score & Feedback Generation
     ↓
9. Result Storage (MongoDB)
     ↓
10. Teacher Review & Approval
     ↓
11. Output to Student
```

### Key Metrics Evaluated
- **Total Marks** & **Percentage**
- **Grade** (A-F scale)
- **Similarity Risk** (Low/Medium/High)
- **Parameter-wise Scores** (Rubric-based)
- **Strengths** Identified
- **Improvement Suggestions**
- **AI Commentary**

## 📁 Project Structure

```
assignments/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # AI/ML services & utils
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js pages
│   │   ├── components/  # UI components
│   │   └── lib/         # Utilities
│   └── public/          # Static assets
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Student
- `POST /api/student/evaluate` - Submit assignment for evaluation
- `GET /api/student/my-submissions` - Get student's submission history
- `GET /api/student/submission/:id` - Get single submission details

### Faculty/Teacher
- `POST /api/faculty/create-session` - Create evaluation session
- `GET /api/faculty/sessions` - Get all sessions
- `GET /api/faculty/submission/:id` - Get submission for review
- `POST /api/faculty/submission/:id/review` - Approve/reject submission
- `POST /api/faculty/session/:id/publish` - Publish approved results

## 🎯 Key Features for Reviewers

### Teacher Approval Workflow
- AI results are not directly shown to students
- Teachers review and approve/reject AI evaluations
- Teachers can modify scores before publishing
- Prevents AI errors from affecting student grades

### Document Management
- Secure cloud storage of student submissions
- Teachers can view/download original documents
- Document links preserved for reference

### Result Integrity
- Optional teacher modifications override AI results
- Approval timestamp tracking
- Student feedback from teachers

## 📝 License

This project is for educational/demonstration purposes.

## 👨‍💻 Author

**Abhishek Anand** - [GitHub](https://github.com/abhishekanandok)

---

*Built with Next.js, Node.js, MongoDB, and OpenAI.*