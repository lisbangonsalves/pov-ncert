import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role?: string
    has_paid?: boolean
    is_blocked?: boolean
  }

  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      has_paid?: boolean
      is_blocked?: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    has_paid?: boolean
    is_blocked?: boolean
    lastRefreshed?: number
  }
}
