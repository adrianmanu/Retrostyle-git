import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { hashPassword, verifyPassword } from '../lib/password'

const USERS_KEY = 'retrostyle-users-v1'
const SESSION_KEY = 'retrostyle-session'

/** SHA-256 de la contraseña por defecto del admin (solo demo local). */
const ADMIN_DEFAULT_HASH =
  '780b7a28627f78c35d473554db6fbff992e4fb75466b33b385a0ccede1b78b66'

export type UserRole = 'customer' | 'admin'

export interface PublicUser {
  id: string
  email: string
  name: string
  role: UserRole
}

interface DbUser extends PublicUser {
  passwordHash: string
}

function loadUsers(): DbUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DbUser[]
  } catch {
    return []
  }
}

function saveUsers(users: DbUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function loadSessionUserId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

function saveSessionUserId(id: string | null) {
  if (id) localStorage.setItem(SESSION_KEY, id)
  else localStorage.removeItem(SESSION_KEY)
}

function ensureSeedAdmin(): DbUser[] {
  let users = loadUsers()
  if (users.some((u) => u.role === 'admin')) return users

  const admin: DbUser = {
    id: 'admin-seed',
    email: 'admin@retrostyle.local',
    name: 'Administrador',
    role: 'admin',
    passwordHash: ADMIN_DEFAULT_HASH,
  }
  users = [...users, admin]
  saveUsers(users)
  return users
}

function toPublic(u: DbUser): PublicUser {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
  }
}

interface AuthContextValue {
  user: PublicUser | null
  ready: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const users = ensureSeedAdmin()
    const sid = loadSessionUserId()
    if (sid) {
      const u = users.find((x) => x.id === sid)
      if (u) setUser(toPublic(u))
    }
    setReady(true)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const users = ensureSeedAdmin()
    const u = users.find(
      (x) => x.email.toLowerCase() === email.trim().toLowerCase(),
    )
    if (!u) return { ok: false, error: 'Email o contraseña incorrectos.' }
    const ok = await verifyPassword(password, u.passwordHash)
    if (!ok) return { ok: false, error: 'Email o contraseña incorrectos.' }
    saveSessionUserId(u.id)
    setUser(toPublic(u))
    return { ok: true }
  }, [])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      if (password.length < 8) {
        return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' }
      }
      let users = ensureSeedAdmin()
      const em = email.trim().toLowerCase()
      if (users.some((x) => x.email.toLowerCase() === em)) {
        return { ok: false, error: 'Ya existe una cuenta con este email.' }
      }
      const passwordHash = await hashPassword(password)
      const newUser: DbUser = {
        id: crypto.randomUUID(),
        email: em,
        name: name.trim(),
        role: 'customer',
        passwordHash,
      }
      users = [...users, newUser]
      saveUsers(users)
      saveSessionUserId(newUser.id)
      setUser(toPublic(newUser))
      return { ok: true }
    },
    [],
  )

  const logout = useCallback(() => {
    saveSessionUserId(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
