import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { getSupabaseAdmin } from './supabase'
import { verifyPassword } from './password'
import type { User } from 'next-auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data: user, error } = await getSupabaseAdmin()
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .single()

        if (error || !user) return null
        if (!verifyPassword(credentials.password as string, user.password)) return null
        if (user.is_blocked) throw new Error('BLOCKED')
        if (!user.email_verified) throw new Error('UNVERIFIED')

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          has_paid: user.has_paid,
          is_blocked: user.is_blocked,
        } as User
      },
    }),
    Credentials({
      id: 'admin',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { data: user, error } = await getSupabaseAdmin()
          .from('users')
          .select('*')
          .eq('email', credentials.email)
          .eq('role', 'admin')
          .single()

        if (error || !user) return null
        if (!verifyPassword(credentials.password as string, user.password)) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          has_paid: user.has_paid,
          is_blocked: user.is_blocked,
        } as User
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.has_paid = (user as any).has_paid
        token.is_blocked = (user as any).is_blocked
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role
        ;(session.user as any).has_paid = token.has_paid
        ;(session.user as any).is_blocked = token.is_blocked
      }
      return session
    },
  },
})
