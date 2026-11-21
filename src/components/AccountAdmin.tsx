import { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { LoaderCircle, MailPlus, RefreshCw, ShieldAlert, UserRoundCheck, UserRoundX } from 'lucide-react';

interface ManagedAccount {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  bannedUntil: string | null;
  role: string | null;
}

interface LoginEvent {
  email: string;
  success: boolean;
  occurredAt: string;
}

interface AdminResponse {
  ok: boolean;
  error?: string;
  users?: ManagedAccount[];
  loginEvents?: LoginEvent[];
}

export default function AccountAdmin({ client }: { client: SupabaseClient }) {
  const [users, setUsers] = useState<ManagedAccount[]>([]);
  const [events, setEvents] = useState<LoginEvent[]>([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const requestData = useCallback(async () => {
    const { data, error: invokeError } = await client.functions.invoke<AdminResponse>('admin-accounts', {
        body: { action: 'list' },
      });
    if (invokeError) throw new Error('Unable to load account administration data.');
    if (!data?.ok) throw new Error(data?.error || 'Unable to load account administration data.');
    return data;
  }, [client]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await requestData();
      setUsers(data.users ?? []);
      setEvents(data.loginEvents ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load account administration data.');
    } finally {
      setLoading(false);
    }
  }, [requestData]);

  useEffect(() => {
    let active = true;
    void requestData()
      .then((data) => {
        if (!active) return;
        setUsers(data.users ?? []);
        setEvents(data.loginEvents ?? []);
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Unable to load account administration data.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [requestData]);

  const invokeAdmin = async (body: Record<string, string | boolean>) => {
    const { data, error: invokeError } = await client.functions.invoke<AdminResponse>('admin-accounts', { body });
    if (invokeError) throw new Error('The account administration service is unavailable.');
    if (!data?.ok) throw new Error(data?.error || 'The requested account action could not be completed.');
    return data;
  };

  const inviteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await invokeAdmin({ action: 'invite', email });
      setEmail('');
      setMessage('Invitation sent. The user can set their password from the email link.');
      await loadData();
    } catch (inviteError) {
      setError(inviteError instanceof Error ? inviteError.message : 'Unable to send the invitation.');
    } finally {
      setBusy(false);
    }
  };

  const setAccountActive = async (user: ManagedAccount, active: boolean) => {
    const confirmation = active
      ? `Re-enable sign-in for ${user.email}?`
      : `Disable future sign-ins for ${user.email}?`;
    if (!window.confirm(confirmation)) return;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await invokeAdmin({ action: 'set-status', userId: user.id, active });
      setMessage(active ? 'Account re-enabled.' : 'Account disabled.');
      await loadData();
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : 'Unable to update this account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-700">Administrator controls</p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-slate-900">Accounts & sign-in history</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Invite users, disable or re-enable sign-in, and review recent attempts. Passwords and IP/device details are not collected.
          </p>
        </div>
        <button type="button" onClick={() => void loadData()} disabled={loading || busy} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <form onSubmit={inviteAccount} className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-end">
        <label className="flex-1 text-sm font-medium text-slate-700">
          Invite a team member
          <input
            autoComplete="email"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
          />
        </label>
        <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-60">
          <MailPlus className="h-4 w-4" /> Send invite
        </button>
      </form>

      {error && <div role="alert" className="mb-5 flex gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"><ShieldAlert className="h-4 w-4 shrink-0" />{error}</div>}
      {message && <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}

      <section className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">User accounts</h2>
          <p className="mt-1 text-xs text-slate-500">Administrators cannot disable their own or other administrator accounts from this page.</p>
        </div>
        {loading ? <LoadingRows /> : users.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3 font-semibold">Account</th><th className="px-5 py-3 font-semibold">Role / status</th><th className="px-5 py-3 font-semibold">Last sign-in</th><th className="px-5 py-3 text-right font-semibold">Control</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const isAdmin = user.role === 'admin';
                  const isActive = !user.bannedUntil;
                  return (
                    <tr key={user.id}>
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">{user.email}</p>
                        <p className="mt-1 text-xs text-slate-400">Added {formatDate(user.createdAt)}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isAdmin ? 'bg-violet-50 text-violet-800' : isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                          {isAdmin ? 'Administrator' : isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{user.lastSignInAt ? formatDate(user.lastSignInAt) : 'Never'}</td>
                      <td className="px-5 py-4 text-right">
                        {isAdmin ? <span className="text-xs text-slate-400">Protected</span> : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void setAccountActive(user, !isActive)}
                            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${isActive ? 'border border-rose-200 text-rose-700 hover:bg-rose-50' : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}
                          >
                            {isActive ? <><UserRoundX className="h-4 w-4" /> Disable</> : <><UserRoundCheck className="h-4 w-4" /> Re-enable</>}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : <p className="px-5 py-8 text-sm text-slate-500">No accounts found.</p>}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Recent sign-in attempts</h2>
          <p className="mt-1 text-xs text-slate-500">Latest 100 attempts, including successful and unsuccessful sign-ins.</p>
        </div>
        {loading ? <LoadingRows /> : events.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-5 py-3 font-semibold">Account email</th><th className="px-5 py-3 font-semibold">Result</th><th className="px-5 py-3 font-semibold">Time</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event, index) => (
                  <tr key={`${event.occurredAt}-${index}`}>
                    <td className="px-5 py-3.5 font-medium text-slate-700">{event.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${event.success ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        {event.success ? 'Successful' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">{formatDateTime(event.occurredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-5 py-8 text-sm text-slate-500">No sign-in attempts recorded yet.</p>}
      </section>
    </main>
  );
}

function LoadingRows() {
  return <div className="flex items-center gap-2 px-5 py-8 text-sm text-slate-500"><LoaderCircle className="h-4 w-4 animate-spin" />Loading…</div>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}
