import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const JWT_SECRET = 'your-secret-key-change-in-production';

// In-memory data storage
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@test.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'John Instructor',
    email: 'instructor@test.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'instructor',
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Jane Student',
    email: 'student@test.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'student',
    createdAt: new Date(),
  },
];

const assessments = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Learn React basics including components, hooks, and state management',
    instructor_id: 2,
    subject: 'Web Development',
    type: 'quiz',
    duration: 30,
    totalQuestions: 5,
    createdAt: new Date(),
    questions: [
      {
        id: 1,
        type: 'mcq',
        text: 'What is React?',
        options: [
          'A JavaScript library for building UIs',
          'A programming language',
          'A database',
          'A server framework',
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        type: 'mcq',
        text: 'What are hooks in React?',
        options: [
          'Functions to add state and side effects to functional components',
          'Methods to debug code',
          'CSS styling techniques',
          'Backend API calls',
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        type: 'short',
        text: 'Explain the concept of component reusability in React',
        correctAnswer: '',
      },
      {
        id: 4,
        type: 'mcq',
        text: 'Which hook is used for side effects in functional components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1,
      },
      {
        id: 5,
        type: 'long',
        text: 'Describe the React lifecycle and how it has changed with hooks',
        correctAnswer: '',
      },
    ],
  },
  {
    id: 2,
    title: 'JavaScript Advanced Topics',
    description: 'Master advanced JavaScript concepts like async/await, promises, and closures',
    instructor_id: 2,
    subject: 'Programming',
    type: 'exam',
    duration: 45,
    totalQuestions: 4,
    createdAt: new Date(),
    questions: [
      {
        id: 1,
        type: 'mcq',
        text: 'What is a closure in JavaScript?',
        options: [
          'A function that returns another function',
          'A function that has access to variables from its outer scope',
          'A loop that closes after execution',
          'A type of error handling',
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        type: 'mcq',
        text: 'Which statement about promises is true?',
        options: [
          'Promises can have multiple handlers',
          'Promises immediately execute',
          'Promises cannot be rejected',
          'Promises are deprecated in ES2020',
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        type: 'short',
        text: 'What is the difference between async/await and promises?',
        correctAnswer: '',
      },
      {
        id: 4,
        type: 'long',
        text: 'Explain event delegation and its benefits in JavaScript',
        correctAnswer: '',
      },
    ],
  },
  {
    id: 3,
    title: 'Data Structures Basics',
    description: 'Fundamental data structures: arrays, linked lists, stacks, and queues',
    instructor_id: 2,
    subject: 'Computer Science',
    type: 'quiz',
    duration: 35,
    totalQuestions: 3,
    createdAt: new Date(),
    questions: [
      {
        id: 1,
        type: 'mcq',
        text: 'What is the time complexity of accessing an element in an array?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 2,
        type: 'mcq',
        text: 'Which data structure uses LIFO principle?',
        options: ['Queue', 'Stack', 'Array', 'Tree'],
        correctAnswer: 1,
      },
      {
        id: 3,
        type: 'short',
        text: 'Explain the difference between a stack and a queue',
        correctAnswer: '',
      },
    ],
  },
];

const submissions = [
  {
    id: 1,
    student_id: 3,
    assessment_id: 1,
    answers: [
      { questionId: 1, answer: 0 },
      { questionId: 2, answer: 0 },
      { questionId: 3, answer: 'React components are reusable and modular pieces of UI' },
      { questionId: 4, answer: 1 },
      { questionId: 5, answer: 'React has lifecycle methods in class components and hooks in functional components' },
    ],
    score: 80,
    status: 'evaluated',
    feedback: 'Great job! You have a solid understanding of React fundamentals.',
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    evaluatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    student_id: 3,
    assessment_id: 2,
    answers: [],
    score: null,
    status: 'pending',
    feedback: '',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    evaluatedAt: null,
  },
];

// Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Auth Routes
app.post('/api/auth/signup', (req, res) => {
  const { name, email, password, role } = req.body;

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role: role || 'student',
    createdAt: new Date(),
  };

  users.push(newUser);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.status(201).json({ message: 'User created successfully', token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
});

app.post('/api/auth/signin', (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.get('/api/auth/verify', verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// User Routes
app.get('/api/users', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  res.json(users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, createdAt: u.createdAt })));
});

app.post('/api/users', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { name, email, password, role } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    role,
    createdAt: new Date(),
  };
  users.push(newUser);
  res.status(201).json({ message: 'User created', user: newUser });
});

app.delete('/api/users/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(index, 1);
  res.json({ message: 'User deleted' });
});

// Assessment Routes
app.get('/api/assessments', verifyToken, (req, res) => {
  res.json(assessments);
});

app.get('/api/assessments/:id', verifyToken, (req, res) => {
  const assessment = assessments.find((a) => a.id === parseInt(req.params.id));
  if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
  res.json(assessment);
});

app.post('/api/assessments', verifyToken, (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const { title, description, subject, type, duration, questions } = req.body;
  const newAssessment = {
    id: assessments.length + 1,
    title,
    description,
    subject,
    type,
    duration,
    totalQuestions: questions.length,
    questions,
    instructor_id: req.user.id,
    createdAt: new Date(),
  };
  assessments.push(newAssessment);
  res.status(201).json({ message: 'Assessment created', assessment: newAssessment });
});

app.put('/api/assessments/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const assessment = assessments.find((a) => a.id === parseInt(req.params.id));
  if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
  
  Object.assign(assessment, req.body);
  res.json({ message: 'Assessment updated', assessment });
});

app.delete('/api/assessments/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const index = assessments.findIndex((a) => a.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Assessment not found' });
  assessments.splice(index, 1);
  res.json({ message: 'Assessment deleted' });
});

// Submission Routes
app.get('/api/submissions', verifyToken, (req, res) => {
  if (req.user.role === 'student') {
    const studentSubmissions = submissions.filter((s) => s.student_id === req.user.id);
    return res.json(studentSubmissions);
  }
  if (req.user.role === 'instructor') {
    const instructorSubmissions = submissions.filter((s) => {
      const assessment = assessments.find((a) => a.id === s.assessment_id);
      return assessment?.instructor_id === req.user.id;
    });
    return res.json(instructorSubmissions);
  }
  res.json(submissions);
});

app.post('/api/submissions', verifyToken, (req, res) => {
  const { assessment_id, answers } = req.body;
  const newSubmission = {
    id: submissions.length + 1,
    student_id: req.user.id,
    assessment_id,
    answers,
    score: null,
    status: 'pending',
    feedback: '',
    submittedAt: new Date(),
    evaluatedAt: null,
  };
  submissions.push(newSubmission);
  res.status(201).json({ message: 'Submission created', submission: newSubmission });
});

app.put('/api/submissions/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const submission = submissions.find((s) => s.id === parseInt(req.params.id));
  if (!submission) return res.status(404).json({ message: 'Submission not found' });
  
  Object.assign(submission, req.body, { evaluatedAt: req.body.status === 'evaluated' ? new Date() : submission.evaluatedAt });
  res.json({ message: 'Submission updated', submission });
});

// Stats Routes
app.get('/api/stats/student', verifyToken, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const studentSubmissions = submissions.filter((s) => s.student_id === req.user.id);
  const evaluatedSubmissions = studentSubmissions.filter((s) => s.status === 'evaluated');
  const averageScore = evaluatedSubmissions.length > 0 
    ? Math.round(evaluatedSubmissions.reduce((sum, s) => sum + s.score, 0) / evaluatedSubmissions.length)
    : 0;

  res.json({
    totalAssessments: assessments.length,
    averageScore,
    pendingEvaluations: studentSubmissions.filter((s) => s.status === 'pending').length,
    completedAssessments: evaluatedSubmissions.length,
  });
});

app.get('/api/stats/instructor', verifyToken, (req, res) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  const instructorAssessments = assessments.filter((a) => a.instructor_id === req.user.id);
  const instructorSubmissions = submissions.filter((s) => {
    const assessment = assessments.find((a) => a.id === s.assessment_id);
    return assessment?.instructor_id === req.user.id;
  });

  res.json({
    totalAssessments: instructorAssessments.length,
    pendingReviews: instructorSubmissions.filter((s) => s.status === 'pending').length,
    evaluatedSubmissions: instructorSubmissions.filter((s) => s.status === 'evaluated').length,
    totalSubmissions: instructorSubmissions.length,
  });
});

app.get('/api/stats/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  res.json({
    totalUsers: users.length,
    totalStudents: users.filter((u) => u.role === 'student').length,
    totalInstructors: users.filter((u) => u.role === 'instructor').length,
    totalAssessments: assessments.length,
    totalSubmissions: submissions.length,
  });
});

// Profile Route
app.get('/api/profile', verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

app.put('/api/profile', verifyToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  if (req.body.name) user.name = req.body.name;
  if (req.body.email) user.email = req.body.email;
  
  res.json({ message: 'Profile updated', user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.put('/api/profile/password', verifyToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = users.find((u) => u.id === req.user.id);
  
  if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }
  
  user.password = bcrypt.hashSync(newPassword, 10);
  res.json({ message: 'Password updated successfully' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
