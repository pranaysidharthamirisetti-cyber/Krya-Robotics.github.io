import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { ArrowLeft, KeyRound, LoaderCircle, LockKeyhole, LogOut, ShieldCheck, Users } from 'lucide-react';
import AccountAdmin from './AccountAdmin';
import TeamWorkspace from './TeamWorkspace';
import { supabase } from '../lib/supabase';

type LoginResponse = {
  ok: boolean;
  error?: string;
  session?: {
    access_token: string;
    refresh_token: string;
  };
};

type HubView = 'workspace' | 'accounts';

export default function TeamHub() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState('');
  const [view, setView] = useState<HubView>('workspace');
  const [recoveringPassword, setRecoveringPassword] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (event === 'PASSWORD_RECOVERY') setRecoveringPassword(true);
      if (!nextSession) setView('workspace');
      setLoading(false);
    });

    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) setError('Unable to verify your sign-in. Please refresh and try again.');
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!supabase) return <SetupRequired />;
  const client = supabase;
  if (loading) {
    return (
      <FullScreenMessage>
        <LoaderCircle className="h-6 w-6 animate-spin text-cyan-600" />
        <span>Checking your account…</span>
      </FullScreenMessage>
    );
  }
  if (!session) {
    return (
      <SignIn
        client={client}
        error={error}
        recoveringPassword={recoveringPassword}
        onError={setError}
        onRecoveryComplete={() => setRecoveringPassword(false)}
      />
    );
  }

  const isAdmin = session.user.app_metadata.role === 'admin';

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <header className="sticky top-0 z-[60] flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
        <a href={`${import.meta.env.BASE_URL}#home`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Krya Robotics</span>
        </a>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="mr-1 max-w-[190px] truncate text-xs text-slate-500 sm:max-w-none">{session.user.email}</span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setView((current) => current === 'accounts' ? 'workspace' : 'accounts')}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                view === 'accounts' ? 'bg-cyan-100 text-cyan-900' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {view === 'accounts' ? <Users className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              {view === 'accounts' ? 'Workspace' : 'Accounts'}
            </button>
          )}
          <button
            type="button"
            onClick={async () => {
              const { error: signOutError } = await client.auth.signOut();
              if (signOutError) setError('Unable to sign out. Please try again.');
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>
      {error && (
        <div role="alert" className="mx-auto mt-4 max-w-5xl rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}
      {view === 'accounts' && isAdmin
        ? <AccountAdmin client={client} />
        : <TeamWorkspace key={session.user.id} storageKey={`krya-team-hub-v1:${session.user.id}`} />}
    </div>
  );
}

function SignIn({
  client,
  error,
  recoveringPassword,
  onError,
  onRecoveryComplete,
}: {
  client: SupabaseClient;
  error: string;
  recoveringPassword: boolean;
  onError: (message: string) => void;
  onRecoveryComplete: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    onError('');
    try {
      const { data, error: invokeError } = await client.functions.invoke<LoginResponse>('account-login', {
        body: { email, password },
      });
      if (invokeError) {
        console.error('Krya secure sign-in service invocation failed:', invokeError);
        throw new Error('The secure sign-in service is unavailable. Please try again later.');
      }
      if (!data?.ok || !data.session) throw new Error(data?.error || 'Sign-in failed. Check your email and password.');

      const { error: sessionError } = await client.auth.setSession(data.session);
      if (sessionError) throw new Error('Your sign-in could not be completed. Please try again.');
      setPassword('');
    } catch (signInError) {
      console.error('Krya sign-in failed:', signInError);
      onError(signInError instanceof Error ? signInError.message : 'Sign-in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const sendRecoveryEmail = async () => {
    setBusy(true);
    setMessage('');
    onError('');
    try {
      if (!email.trim()) throw new Error('Enter your account email first.');
      const redirectTo = new URL(window.location.pathname, window.location.origin);
      redirectTo.searchParams.set('view', 'team');
      const { error: recoveryError } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectTo.toString(),
      });
      if (recoveryError) throw recoveryError;
      setMessage('If an account exists for that email, a password reset link is on its way.');
    } catch (recoveryError) {
      onError(recoveryError instanceof Error ? recoveryError.message : 'Unable to send a password reset email.');
    } finally {
      setBusy(false);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    onError('');
    try {
      if (newPassword.length < 12) throw new Error('Use at least 12 characters for your new password.');
      const { error: updateError } = await client.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;
      setNewPassword('');
      setMessage('Password updated. You are now signed in.');
      onRecoveryComplete();
    } catch (updateError) {
      onError(updateError instanceof Error ? updateError.message : 'Unable to update your password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-3rem)] items-center justify-center px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9">
        <a href={`${import.meta.env.BASE_URL}#home`} className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Back to Krya Robotics
        </a>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
          {recoveringPassword ? <KeyRound className="h-6 w-6" /> : <LockKeyhole className="h-6 w-6" />}
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">Krya Robotics</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900">
          {recoveringPassword ? 'Choose a new password' : 'Team Hub sign in'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {recoveringPassword
            ? 'Use at least 12 characters. Your password is handled by Supabase Auth.'
            : 'Accounts are invitation-only. Ask a Krya administrator to invite you.'}
        </p>

        {recoveringPassword ? (
          <form onSubmit={updatePassword} className="mt-7 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              New password
              <input
                autoComplete="new-password"
                minLength={12}
                required
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </label>
            <button disabled={busy} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </form>
        ) : (
          <form onSubmit={signIn} className="mt-7 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                autoComplete="username"
                autoCapitalize="none"
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                autoComplete="current-password"
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
            </label>
            {error && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
            {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
            <button disabled={busy} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
            <button type="button" disabled={busy} onClick={() => void sendRecoveryEmail()} className="w-full py-2 text-sm font-semibold text-cyan-800 hover:text-cyan-950 disabled:opacity-60">
              Forgot password?
            </button>
          </form>
        )}
        {recoveringPassword && error && <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</p>}
        {recoveringPassword && message && <p role="status" className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
        <p className="mt-7 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-400">
          Sign-in events record only the account email, time, and success or failure. Passwords are never stored in the event history.
        </p>
      </section>
    </main>
  );
}

function SetupRequired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="max-w-lg rounded-3xl border border-amber-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Team Hub sign-in needs setup</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to the local <code>.env.local</code> file and the GitHub Actions repository secrets.
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Only use a publishable key in browser code. Never put a Supabase service-role or secret key in this site.
        </p>
        <a href={`${import.meta.env.BASE_URL}#home`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-800 hover:text-cyan-950">
          <ArrowLeft className="h-4 w-4" /> Return to the website
        </a>
      </section>
    </main>
  );
}

function FullScreenMessage({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center gap-3 bg-slate-50 text-sm font-medium text-slate-600">
      {children}
    </main>
  );
}
