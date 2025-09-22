import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { users, dailyLogs, habits, habitLogs, userSettings, calorieCalculations, windowPlans } from '../shared/schema.js';
import type { User, NewUser, DailyLog, NewDailyLog, Habit, NewHabit, HabitLog, NewHabitLog, UserSettings, NewUserSettings, CalorieCalculation, NewCalorieCalculation, WindowPlan, NewWindowPlan } from '../shared/schema.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Database setup
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com"],
    },
  },
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
      
      if (user.length === 0) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isValidPassword = await bcrypt.compare(password, user[0].password);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user[0]);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    done(null, user[0] || null);
  } catch (error) {
    done(error);
  }
});

// Authentication middleware
const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, username, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser: NewUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username: username || email.split('@')[0],
      phoneNumber,
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    // Create default user settings
    const defaultSettings: NewUserSettings = {
      userId: createdUser.id,
      theme: 'light',
      notifications: true,
      defaultFastingHours: 16,
      weightUnit: 'kg',
      heightUnit: 'cm',
      timezone: 'UTC',
    };

    await db.insert(userSettings).values(defaultSettings);

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        username: createdUser.username,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err: any, user: User, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ error: info.message || 'Invalid credentials' });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
        }
      });
    });
  })(req, res, next);
});

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

app.get('/api/me', requireAuth, (req, res) => {
  const user = req.user as User;
  res.json({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
  });
});

// Daily logs routes
app.get('/api/daily-logs', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const logs = await db.select().from(dailyLogs).where(eq(dailyLogs.userId, user.id));
    res.json(logs);
  } catch (error) {
    console.error('Error fetching daily logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/daily-logs', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const logData: NewDailyLog = {
      ...req.body,
      userId: user.id,
    };

    const [createdLog] = await db.insert(dailyLogs).values(logData).returning();
    res.status(201).json(createdLog);
  } catch (error) {
    console.error('Error creating daily log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/daily-logs/:id', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const logId = parseInt(req.params.id);

    const [updatedLog] = await db
      .update(dailyLogs)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(dailyLogs.id, logId) && eq(dailyLogs.userId, user.id))
      .returning();

    if (!updatedLog) {
      return res.status(404).json({ error: 'Daily log not found' });
    }

    res.json(updatedLog);
  } catch (error) {
    console.error('Error updating daily log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/daily-logs/:id', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const logId = parseInt(req.params.id);

    await db
      .delete(dailyLogs)
      .where(eq(dailyLogs.id, logId) && eq(dailyLogs.userId, user.id));

    res.json({ message: 'Daily log deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily log:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Habits routes
app.get('/api/habits', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const userHabits = await db.select().from(habits).where(eq(habits.userId, user.id));
    res.json(userHabits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/habits', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const habitData: NewHabit = {
      ...req.body,
      userId: user.id,
    };

    const [createdHabit] = await db.insert(habits).values(habitData).returning();
    res.status(201).json(createdHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Calorie calculations routes
app.get('/api/calorie-calculations', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const calculations = await db.select().from(calorieCalculations).where(eq(calorieCalculations.userId, user.id));
    res.json(calculations);
  } catch (error) {
    console.error('Error fetching calorie calculations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/calorie-calculations', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const calculationData: NewCalorieCalculation = {
      ...req.body,
      userId: user.id,
    };

    const [createdCalculation] = await db.insert(calorieCalculations).values(calculationData).returning();
    res.status(201).json(createdCalculation);
  } catch (error) {
    console.error('Error creating calorie calculation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Window plans routes
app.get('/api/window-plans', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const plans = await db.select().from(windowPlans).where(eq(windowPlans.userId, user.id));
    res.json(plans);
  } catch (error) {
    console.error('Error fetching window plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/window-plans', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const planData: NewWindowPlan = {
      ...req.body,
      userId: user.id,
    };

    const [createdPlan] = await db.insert(windowPlans).values(planData).returning();
    res.status(201).json(createdPlan);
  } catch (error) {
    console.error('Error creating window plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User settings routes
app.get('/api/settings', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    const settings = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
    res.json(settings[0] || {});
  } catch (error) {
    console.error('Error fetching user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/settings', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    
    const [updatedSettings] = await db
      .update(userSettings)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(userSettings.userId, user.id))
      .returning();

    res.json(updatedSettings);
  } catch (error) {
    console.error('Error updating user settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI-powered meal generation (placeholder for OpenAI integration)
app.post('/api/generate-meals', requireAuth, async (req, res) => {
  try {
    const { calories, protein, carbs, fat, mealCount, mode } = req.body;
    
    // This would integrate with OpenAI API
    // For now, return mock data
    const mockMeals = [
      {
        id: 1,
        name: mode === 'clean' ? '6oz Chicken Breast with Rice' : 'Chipotle Chicken Bowl',
        calories: Math.round(calories / mealCount),
        protein: Math.round(protein / mealCount),
        carbs: Math.round(carbs / mealCount),
        fat: Math.round(fat / mealCount),
        ingredients: mode === 'clean' 
          ? ['6oz chicken breast', '1 cup white rice', '1 tbsp olive oil']
          : ['Chicken bowl with rice, beans, salsa, cheese'],
        time: '12:00 PM',
      }
    ];

    res.json({ meals: mockMeals });
  } catch (error) {
    console.error('Error generating meals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});