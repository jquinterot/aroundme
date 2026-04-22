---
name: auth-flow
description: Implement authentication features including login, signup, OAuth, password reset, and session management. Use for auth-related changes.
---

This skill guides authentication implementation in the AroundMe application.

## Auth Architecture

- `src/lib/auth.ts` - Auth utilities (hashing, sessions)
- `src/app/api/auth/` - Auth API routes
- `src/contexts/AuthContext.tsx` - Client-side auth state
- `src/middleware.ts` - Route protection

## Password Hashing

Uses bcrypt with 12 rounds:

```typescript
import bcrypt from 'bcrypt';

// Hash password
const hashedPassword = await bcrypt.hash(password, 12);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

## Session Management

Sessions stored in database with secure cookies:

```typescript
import { createSession, getSession, deleteSession } from '@/lib/auth';

// Create session (login)
const session = await createSession(userId);

// Get current session
const session = await getSession();
if (!session) {
  return errorResponse('Unauthorized', 401, 'UNAUTHORIZED');
}

// Delete session (logout)
await deleteSession();
```

### Session Cookie Settings
```typescript
{
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
}
```

## Login Flow

```typescript
// POST /api/auth/login
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return errorResponse('Invalid credentials', 401, 'AUTH_ERROR');
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return errorResponse('Invalid credentials', 401, 'AUTH_ERROR');
  }

  // Create session
  await createSession(user.id);

  return successResponse({ 
    id: user.id, 
    name: user.name, 
    email: user.email 
  });
}
```

## Signup Flow

```typescript
// POST /api/auth/register
export async function POST(request: NextRequest) {
  const { name, email, password } = await request.json();

  // Check if email exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return errorResponse('Email already registered', 409, 'EMAIL_EXISTS');
  }

  // Validate password strength
  if (password.length < 8) {
    return errorResponse('Password too weak', 400, 'WEAK_PASSWORD');
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // Create session
  await createSession(user.id);

  return successResponse({ 
    id: user.id, 
    name: user.name, 
    email: user.email 
  }, 'Account created');
}
```

## Logout Flow

```typescript
// POST /api/auth/logout
export async function POST() {
  await deleteSession();
  return successResponse(null, 'Logged out');
}
```

## Protected API Routes

```typescript
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return errorResponse('Please log in to continue', 401, 'UNAUTHORIZED');
  }

  const userId = session.id;
  // ... use userId for operations
}
```

## Protected Pages

Client-side protection:

```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return <div>Protected content</div>;
}
```

## OAuth Pattern

Google OAuth callback:

```typescript
// GET /api/auth/oauth/google/callback
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  
  // Exchange code for tokens
  const tokens = await exchangeCodeForTokens(code);
  
  // Get user info
  const userInfo = await getUserInfo(tokens.access_token);
  
  // Find or create user
  let user = await prisma.user.findUnique({ 
    where: { oauthProviderId: userInfo.id } 
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        oauthProvider: 'google',
        oauthProviderId: userInfo.id,
      },
    });
  }

  // Create session
  await createSession(user.id);
  
  // Redirect to dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
```

## Rate Limiting Auth Endpoints

```typescript
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  
  // 5 attempts per minute
  const rateLimit = checkRateLimit(`login:${clientIp}`, 5, 60000);
  if (!rateLimit.allowed) {
    return errorResponse(
      'Too many attempts. Try again later.',
      429,
      'RATE_LIMITED'
    );
  }

  // ... login logic
}
```

## Auth Context

```typescript
// src/contexts/AuthContext.tsx
'use client';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const res = await fetch('/api/auth/me');
    const data = await res.json();
    setUser(data.success ? data.data : null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Test Credentials

For development:
```
Email: admin@aroundme.co
Password: admin123
```

## Security Checklist

- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] Sessions stored in database (not JWT)
- [ ] HttpOnly, Secure, SameSite cookies
- [ ] Rate limiting on login/signup
- [ ] No password in error messages
- [ ] OAuth state parameter validated
- [ ] Password reset tokens expire
- [ ] Email verification optional but recommended
