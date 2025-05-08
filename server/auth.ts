import { Request, Response, NextFunction, Express } from 'express';
import session from 'express-session';
import { storage } from './storage';
import { LoginData, RegisterData } from '@shared/schema';
import { nanoid } from 'nanoid';

// Rozszerzenie dla Session
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      username: string;
      role: string;
    };
  }
}

// Dla typescripta - rozszerzenie typu Request
declare global {
  namespace Express {
    interface Request {
      session: session.Session & { 
        user?: {
          id: string;
          username: string;
          role: string;
        }
      };
    }
  }
}

// Ustawienie sesji
export function setupSession(app: Express) {
  const sessionConfig: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'tajny-klucz-tymczasowy',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni
    }
  };

  // W produkcji ustaw cookie.secure na true
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie!.secure = true;
  }

  app.use(session(sessionConfig));
}

// Middleware sprawdzające czy użytkownik jest zalogowany
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}

// Middleware sprawdzające czy użytkownik ma uprawnienia administratora
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Forbidden - Admin access required' });
}

// Funkcja do rejestracji nowego użytkownika
export async function registerUser(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body as RegisterData;
    
    // Sprawdź czy użytkownik już istnieje
    const existingUser = await storage.getUserByUsername(username) || 
                         await storage.getUserByEmail(email);
    
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Użytkownik o takiej nazwie lub adresie email już istnieje' 
      });
    }
    
    // Utwórz nowego użytkownika
    const user = await storage.createLocalUser(username, email, password);
    
    // Zaloguj użytkownika automatycznie po rejestracji
    req.session.user = {
      id: user.id, // Poprawny typ: number
      username: user.username,
      role: user.role || 'client'
    };
    
    return res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas rejestracji' });
  }
}

// Funkcja do logowania użytkownika
export async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body as LoginData;
    
    console.log(`Próba logowania użytkownika: ${username}`);
    
    // Walidacja hasła
    const user = await storage.validatePassword(username, password);
    
    if (!user) {
      console.log("Logowanie nieudane - nieprawidłowe dane");
      return res.status(401).json({ message: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }
    
    console.log(`Logowanie udane: ${username}, ID: ${user.id}, typ ID: ${typeof user.id}`);
    
    // Ustaw sesję
    req.session.user = {
      id: user.id.toString(), // Konwersja ID na string dla sesji
      username: user.username,
      role: user.role || 'client'
    };
    
    return res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Wystąpił błąd podczas logowania' });
  }
}

// Funkcja do wylogowania użytkownika
export function logoutUser(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).json({ message: 'Wystąpił błąd podczas wylogowania' });
    }
    
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Wylogowano pomyślnie' });
  });
}

// Funkcja do pobierania danych zalogowanego użytkownika
export async function getCurrentUser(req: Request, res: Response) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const userId = parseInt(req.session.user.id, 10);
  const user = await storage.getUser(userId);
  
  if (!user) {
    // Jeśli użytkownik nie istnieje w bazie danych, wyczyść sesję
    req.session.destroy(() => {});
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Zwróć tylko bezpieczne dane użytkownika (bez hasła)
  return res.status(200).json({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImage // Używamy poprawnej nazwy pola
  });
}

// Funkcja rejestrująca wszystkie endpointy uwierzytelniania
export function setupLocalAuth(app: Express) {
  // Endpointy uwierzytelniania
  app.post('/api/auth/register', registerUser);
  app.post('/api/auth/login', loginUser);
  app.post('/api/auth/logout', logoutUser);
  app.get('/api/auth/user', getCurrentUser);
}