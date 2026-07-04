import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AtSign, Calendar, Eye, EyeOff, Globe, Lock, Mail, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/shared/lib/utils'
import { BrandMark } from '@/shared/components/brand-mark'
import { GridBackdrop } from '@/shared/components/grid-backdrop'
import { IconInput } from '@/shared/components/icon-input'
import { ThemeToggle } from '@/shared/theme/theme-toggle'
import { useAuth } from '../auth-context'

type Mode = 'login' | 'signup'

export function AuthPage() {
  const { login, register, isAuthenticated, enterDemo } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('login')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dob, setDob] = useState('')

  const isSignup = mode === 'signup'

  // Already signed in (e.g. navigated back to /login)? Send them into the app.
  if (isAuthenticated) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isSignup) {
        await register({ name, username, email, password, dateOfBirth: dob })
      } else {
        await login(username, password)
      }
      navigate('/')
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center p-8">
      <GridBackdrop />

      <ThemeToggle className="fixed right-[18px] top-[18px] z-10 size-[38px] rounded-[10px]" />

      <div className="relative z-[1] flex w-full max-w-[404px] flex-col items-center gap-[22px]">
        <div className="flex items-center gap-[11px]">
          <BrandMark size={36} radius={11} />
          <span className="text-[22px] font-bold tracking-[-0.02em]">Daily Dojo</span>
        </div>

        <div className="w-full rounded-[20px] border border-border bg-card p-7 shadow-[var(--shadow-panel)]">
          {/* segmented login/signup switch */}
          <div className="mb-[22px] flex gap-1 rounded-[11px] bg-secondary p-1">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 rounded-lg py-[9px] text-center text-[13px] font-semibold transition-colors',
                  mode === m
                    ? 'bg-card text-foreground shadow-[var(--shadow-card)] dark:bg-popover'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          <h1 className="mb-0.5 text-[21px] font-bold tracking-[-0.02em]">
            {isSignup ? 'Start your dojo' : 'Welcome back'}
          </h1>
          <p className="mb-5 text-[13px] text-muted-foreground">
            {isSignup
              ? 'Build calm, focused habits — one day at a time.'
              : 'Pick up your practice where you left off.'}
          </p>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-[15px]">
                <Label htmlFor="name" className="mb-[7px] block">
                  Name
                </Label>
                <IconInput
                  id="name"
                  icon={User}
                  placeholder="Aki Kato"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="mb-[15px]">
              <Label htmlFor="username" className="mb-[7px] block">
                Username
              </Label>
              <IconInput
                id="username"
                icon={AtSign}
                placeholder="aki"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {isSignup && (
              <div className="mb-[15px]">
                <Label htmlFor="email" className="mb-[7px] block">
                  Email
                </Label>
                <IconInput
                  id="email"
                  type="email"
                  icon={Mail}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="mb-[15px]">
              <Label htmlFor="password" className="mb-[7px] block">
                Password
              </Label>
              <IconInput
                id="password"
                type={showPw ? 'text' : 'password'}
                icon={Lock}
                placeholder="••••••••"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="inline-flex text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? (
                      <EyeOff className="size-[17px]" />
                    ) : (
                      <Eye className="size-[17px]" />
                    )}
                  </button>
                }
              />
            </div>

            {isSignup ? (
              <div className="mb-[15px]">
                <Label htmlFor="dob" className="mb-[7px] block">
                  Date of birth
                </Label>
                <IconInput
                  id="dob"
                  type="date"
                  icon={Calendar}
                  autoComplete="bday"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
            ) : (
              <div className="-mt-0.5 mb-5 flex items-center justify-between">
                <Label className="font-normal text-muted-foreground">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                  />
                  Remember me
                </Label>
                <a
                  href="#"
                  className="text-[13px] font-semibold text-foreground hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full rounded-[11px]"
            >
              {submitting
                ? isSignup
                  ? 'Creating account…'
                  : 'Signing in…'
                : isSignup
                  ? 'Create account'
                  : 'Log in'}
            </Button>
          </form>

          <div className="my-[18px] flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border before:content-[''] after:h-px after:flex-1 after:bg-border after:content-['']">
            or
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() =>
              toast.info('Social sign-in isn’t available yet — use a username and password.')
            }
            className="w-full gap-[9px] rounded-[11px]"
          >
            <Globe className="size-[17px]" />
            Continue with Google
          </Button>

          <p className="mt-[18px] text-center text-[13px] text-muted-foreground">
            {isSignup ? 'Already training? ' : 'New to Daily Dojo? '}
            <button
              type="button"
              onClick={() => setMode(isSignup ? 'login' : 'signup')}
              className="font-semibold text-foreground hover:underline"
            >
              {isSignup ? 'Log in' : 'Create an account'}
            </button>
          </p>

          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={() => {
                enterDemo()
                navigate('/')
              }}
              className="mt-[18px] w-full rounded-[11px] border border-dashed border-border py-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              Enter demo — skip sign-in (dev only)
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
