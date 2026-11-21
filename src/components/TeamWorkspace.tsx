import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  Activity,
  ArrowLeft,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  FolderKanban,
  Plus,
  Radio,
  Settings2,
  ShieldAlert,
  Users,
  X,
} from 'lucide-react';

type RobotType = 'Competition' | 'Research & Development';
type TaskStatus = 'Not started' | 'In progress' | 'Needs review' | 'Done';
type View = 'Overview' | 'Tasks' | RobotType | 'Projects';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface Robot {
  id: string;
  name: string;
  type: RobotType;
  projectId: string;
  members: string[];
}

interface Task {
  id: string;
  title: string;
  robotId: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  update: string;
  updatedAt: string;
}

interface HubData {
  projects: Project[];
  robots: Robot[];
  tasks: Task[];
}

const STATUS_OPTIONS: TaskStatus[] = ['Not started', 'In progress', 'Needs review', 'Done'];
const EXAMPLE_ROBOT_IDS = new Set(['bot-atlas', 'bot-scout', 'bot-lumen']);

function getInitialData(): HubData {
  const firstProject = 'project-rover';
  const secondProject = 'project-vision';

  return {
    projects: [
      { id: firstProject, name: 'Rover Challenge 2026', description: 'Competition platform and field tests' },
      { id: secondProject, name: 'Vision Lab', description: 'Perception research and prototypes' },
    ],
    robots: [],
    tasks: [],
  };
}

function readHubData(storageKey: string): HubData {
  try {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return getInitialData();
    const parsed: unknown = JSON.parse(stored);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'projects' in parsed &&
      'robots' in parsed &&
      'tasks' in parsed &&
      Array.isArray(parsed.projects) &&
      Array.isArray(parsed.robots) &&
      Array.isArray(parsed.tasks)
    ) {
      const saved = parsed as HubData;
      const cleaned = {
        ...saved,
        robots: saved.robots.filter((robot) => !EXAMPLE_ROBOT_IDS.has(robot.id)),
        tasks: saved.tasks.filter((task) => !EXAMPLE_ROBOT_IDS.has(task.robotId)),
      };
      if (cleaned.robots.length !== saved.robots.length || cleaned.tasks.length !== saved.tasks.length) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(cleaned));
        } catch (error) {
          console.error('Unable to remove the example robots from saved workspace data.', error);
        }
      }
      return cleaned;
    }
    throw new Error('Stored workspace data has an unexpected format.');
  } catch (error) {
    console.error('Unable to load the saved Krya workspace.', error);
    return getInitialData();
  }
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(value: string) {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function getDateLabel(value: string) {
  if (!value) return 'No due date';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${value}T00:00:00`);
  const days = Math.round((due.getTime() - today.getTime()) / 86400000);
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due ${formatDate(value)}`;
}

export default function TeamWorkspace({ storageKey }: { storageKey: string }) {
  const [data, setData] = useState(() => readHubData(storageKey));
  const [view, setView] = useState<View>('Overview');
  const [modal, setModal] = useState<'task' | 'project' | 'robot' | null>(null);
  const [storageError, setStorageError] = useState(false);

  const saveData = (next: HubData) => {
    setData(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setStorageError(false);
    } catch (error) {
      console.error('Unable to save the Krya workspace in this browser.', error);
      setStorageError(true);
    }
  };

  const openTasks = data.tasks.filter((task) => task.status !== 'Done').length;
  const activeRobots = data.robots.length;
  const nextTasks = useMemo(
    () =>
      data.tasks
        .filter((task) => task.status !== 'Done' && task.dueDate)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 4),
    [data.tasks],
  );

  const updateTask = (id: string, updates: Partial<Task>) => {
    saveData({
      ...data,
      tasks: data.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: 'Just now' } : task,
      ),
    });
  };

  const addProject = (name: string, description: string) => {
    const project = { id: makeId('project'), name, description };
    saveData({ ...data, projects: [project, ...data.projects] });
    setModal(null);
    setView('Projects');
  };

  const addRobot = (name: string, type: RobotType, projectId: string, members: string[]) => {
    const robot = { id: makeId('bot'), name, type, projectId, members };
    saveData({ ...data, robots: [robot, ...data.robots] });
    setModal(null);
    setView(type);
  };

  const addTask = (title: string, robotId: string, assignee: string, dueDate: string) => {
    const task: Task = {
      id: makeId('task'),
      title,
      robotId,
      assignee,
      dueDate,
      status: 'Not started',
      update: '',
      updatedAt: 'Just now',
    };
    saveData({ ...data, tasks: [task, ...data.tasks] });
    setModal(null);
    setView('Tasks');
  };

  const navItems: { label: View; icon: typeof Activity }[] = [
    { label: 'Overview', icon: Activity },
    { label: 'Tasks', icon: ClipboardList },
    { label: 'Competition', icon: Radio },
    { label: 'Research & Development', icon: Bot },
    { label: 'Projects', icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <a href={`${import.meta.env.BASE_URL}#home`} className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
          <img src={`${import.meta.env.BASE_URL}logo.jpeg`} alt="" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <div className="font-display text-xl font-bold tracking-wide text-slate-900">KRYA</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Team workspace</div>
          </div>
        </a>
        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setView(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  view === label ? 'bg-cyan-50 text-cyan-800' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span className="truncate">{label === 'Research & Development' ? 'R&D bots' : label}</span>
                {label === 'Tasks' && <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs">{openTasks}</span>}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto space-y-3 p-4">
          <div className="rounded-2xl border border-amber-100 bg-amber-50/80 p-3.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
              <ShieldAlert className="h-4 w-4" /> Demo workspace
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-amber-800/80">Saved only in this browser. Not shared with your team.</p>
          </div>
          <a href={`${import.meta.env.BASE_URL}#home`} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back to Krya Robotics
          </a>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <img src={`${import.meta.env.BASE_URL}logo.jpeg`} alt="" className="h-9 w-9 rounded-lg object-cover lg:hidden" />
            <div>
              <p className="text-xs font-medium text-slate-400">Krya Robotics / Team Hub</p>
              <h1 className="text-base font-semibold text-slate-900">{view}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`${import.meta.env.BASE_URL}#home`} className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 sm:block">
              Main site
            </a>
            <button
              onClick={() => setModal('task')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              <Plus className="h-4 w-4" /><span className="hidden sm:inline">New task</span><span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        <nav aria-label="Workspace sections" className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          {navItems.map(({ label }) => (
            <button
              key={label}
              onClick={() => setView(label)}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${
                view === label ? 'bg-cyan-50 text-cyan-800' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {label === 'Research & Development' ? 'R&D bots' : label}
            </button>
          ))}
        </nav>

        <main className="mx-auto max-w-[1440px] px-5 py-7 md:px-8 md:py-9">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-cyan-700">Good to see you</p>
              <h2 className="mt-1 font-display text-3xl font-semibold tracking-tight text-slate-900">Build together.</h2>
              <p className="mt-2 text-sm text-slate-500">A home for your robot projects, task updates, and team plans.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal('project')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                <FolderKanban className="h-4 w-4" /> New project
              </button>
              <button onClick={() => setModal('robot')} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                <Bot className="h-4 w-4" /> Add bot
              </button>
            </div>
          </div>

          {(storageError || view === 'Overview') && (
            <div className={`mb-6 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${storageError ? 'border-rose-200 bg-rose-50 text-rose-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
              {storageError ? <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />}
              <p>
                {storageError
                  ? 'This browser could not save your changes. Check its storage settings before continuing.'
                  : 'Prototype mode: this workspace is stored in this browser only. It has no real sign-in, shared team data, or email reminders. Don’t enter passwords or sensitive information.'}
              </p>
            </div>
          )}

          {view === 'Overview' && (
            <>
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Active projects" value={data.projects.length} detail="Across your workspace" icon={FolderKanban} tint="cyan" />
                <StatCard label="Robots tracked" value={activeRobots} detail={`${data.robots.filter((bot) => bot.type === 'Competition').length} competition · ${data.robots.filter((bot) => bot.type === 'Research & Development').length} R&D`} icon={Bot} tint="violet" />
                <StatCard label="Open tasks" value={openTasks} detail={`${data.tasks.filter((task) => task.status === 'Needs review').length} waiting for review`} icon={ClipboardList} tint="amber" />
                <StatCard label="Team members" value={new Set(data.robots.flatMap((bot) => bot.members)).size} detail="Assigned across bots" icon={Users} tint="green" />
              </section>

              <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
                <Panel title="Team tasks" subtitle="Recent progress from across your robots" action={<button onClick={() => setView('Tasks')} className="text-xs font-semibold text-cyan-700 hover:text-cyan-900">View all</button>}>
                  <TaskList tasks={data.tasks.slice(0, 4)} robots={data.robots} onUpdate={updateTask} />
                </Panel>
                <Panel title="Coming up" subtitle="Upcoming task deadlines" action={<CalendarDays className="h-4 w-4 text-slate-400" />}>
                  {nextTasks.length ? (
                    <div className="space-y-4">
                      {nextTasks.map((task) => (
                        <div key={task.id} className="flex items-start gap-3">
                          <div className="mt-0.5 rounded-lg bg-cyan-50 p-2 text-cyan-700"><CalendarDays className="h-4 w-4" /></div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">{task.title}</p>
                            <p className="mt-1 text-xs text-slate-500">{getRobotName(task.robotId, data.robots)} · {task.assignee || 'Unassigned'}</p>
                          </div>
                          <span className={`whitespace-nowrap text-[11px] font-semibold ${getDateLabel(task.dueDate) === 'Overdue' ? 'text-rose-600' : 'text-slate-500'}`}>{getDateLabel(task.dueDate)}</span>
                        </div>
                      ))}
                    </div>
                  ) : <EmptyState text="No upcoming deadlines. Add a task to get started." />}
                </Panel>
              </section>

              <section className="mt-6">
                <Panel title="Your robots" subtitle="The two tracks powering your work" action={<Settings2 className="h-4 w-4 text-slate-400" />}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <RobotTrack type="Competition" robots={data.robots} projects={data.projects} tasks={data.tasks} onOpen={() => setView('Competition')} />
                    <RobotTrack type="Research & Development" robots={data.robots} projects={data.projects} tasks={data.tasks} onOpen={() => setView('Research & Development')} />
                  </div>
                </Panel>
              </section>
            </>
          )}

          {view === 'Tasks' && (
            <Panel title="All tasks" subtitle="Update task status and share a short progress note" action={<button onClick={() => setModal('task')} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700"><Plus className="h-4 w-4" /> Add task</button>}>
              <TaskList tasks={data.tasks} robots={data.robots} onUpdate={updateTask} />
            </Panel>
          )}

          {(view === 'Competition' || view === 'Research & Development') && (
            <Panel title={`${view} bots`} subtitle={`Manage robots and the people working on ${view === 'Competition' ? 'competitions' : 'research and development'}`} action={<button onClick={() => setModal('robot')} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700"><Plus className="h-4 w-4" /> Add bot</button>}>
              <RobotGrid type={view} robots={data.robots} projects={data.projects} tasks={data.tasks} />
            </Panel>
          )}

          {view === 'Projects' && (
            <Panel title="Projects" subtitle="Organize bots and tasks by project" action={<button onClick={() => setModal('project')} className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700"><Plus className="h-4 w-4" /> New project</button>}>
              {data.projects.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {data.projects.map((project) => {
                    const projectRobots = data.robots.filter((bot) => bot.projectId === project.id);
                    const projectTasks = data.tasks.filter((task) => projectRobots.some((bot) => bot.id === task.robotId));
                    const done = projectTasks.filter((task) => task.status === 'Done').length;
                    return (
                      <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-700"><FolderKanban className="h-5 w-5" /></div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{projectRobots.length} bots</span>
                        </div>
                        <h3 className="mt-4 font-semibold text-slate-900">{project.name}</h3>
                        <p className="mt-1 min-h-10 text-sm text-slate-500">{project.description || 'No description yet.'}</p>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                          <span>{projectTasks.length} tasks</span><span>{done} completed</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : <EmptyState text="No projects yet. Create one to organize your robots." />}
            </Panel>
          )}
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-20 flex items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 py-2 text-[11px] font-medium text-slate-500 shadow-lg backdrop-blur">
        <Bell className="h-3.5 w-3.5" /> Due dates shown here · notifications not enabled
      </div>

      {modal && (
        <Modal title={modal === 'task' ? 'Create a task' : modal === 'project' ? 'Create a project' : 'Add a robot'} onClose={() => setModal(null)}>
          {modal === 'task' && <TaskForm robots={data.robots} onSubmit={addTask} onCancel={() => setModal(null)} />}
          {modal === 'project' && <ProjectForm onSubmit={addProject} onCancel={() => setModal(null)} />}
          {modal === 'robot' && <RobotForm projects={data.projects} onSubmit={addRobot} onCancel={() => setModal(null)} />}
        </Modal>
      )}
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon, tint }: { label: string; value: number; detail: string; icon: typeof Activity; tint: string }) {
  const colors: Record<string, string> = {
    cyan: 'bg-cyan-50 text-cyan-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`rounded-xl p-2 ${colors[tint]}`}><Icon className="h-[18px] w-[18px]" /></div>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function Panel({ title, subtitle, action, children }: { title: string; subtitle: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.02]">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 md:px-6">
        <div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p></div>
        {action}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function TaskList({ tasks, robots, onUpdate }: { tasks: Task[]; robots: Robot[]; onUpdate: (id: string, updates: Partial<Task>) => void }) {
  if (!tasks.length) return <EmptyState text="No tasks yet. Create a task and assign it to a team member." />;
  return (
    <div className="divide-y divide-slate-100">
      {tasks.map((task) => (
        <article key={task.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-800">{task.title}</h4>
              <p className="mt-1.5 text-xs text-slate-500">{getRobotName(task.robotId, robots)} <span className="px-1 text-slate-300">·</span> {task.assignee || 'Unassigned'} <span className="px-1 text-slate-300">·</span> {getDateLabel(task.dueDate)}</p>
            </div>
            <label className="relative shrink-0">
              <span className="sr-only">Task status</span>
              <select value={task.status} onChange={(event) => onUpdate(task.id, { status: event.target.value as TaskStatus })} className={`appearance-none rounded-full border-0 py-1.5 pl-3 pr-8 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-300 ${statusClass(task.status)}`}>
                {STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
            </label>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              aria-label={`Progress update for ${task.title}`}
              value={task.update}
              onChange={(event) => onUpdate(task.id, { update: event.target.value })}
              placeholder="Share a quick progress update..."
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:bg-white"
            />
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400 sm:w-24 sm:justify-end">
              {task.updatedAt && <><Check className="h-3 w-3 text-emerald-500" /> {task.updatedAt}</>}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}

function RobotTrack({ type, robots, projects, tasks, onOpen }: { type: RobotType; robots: Robot[]; projects: Project[]; tasks: Task[]; onOpen: () => void }) {
  const list = robots.filter((bot) => bot.type === type);
  const isCompetition = type === 'Competition';
  return (
    <button onClick={onOpen} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-cyan-200 hover:bg-cyan-50/30">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-2.5 ${isCompetition ? 'bg-violet-50 text-violet-700' : 'bg-cyan-50 text-cyan-700'}`}><Bot className="h-5 w-5" /></div>
        <span className="text-xs font-semibold text-slate-500">{list.length} bots <span className="pl-1">→</span></span>
      </div>
      <h4 className="mt-3 font-semibold text-slate-900">{type}</h4>
      <p className="mt-1 text-xs text-slate-500">{isCompetition ? 'Prepare, test, and compete.' : 'Explore ideas and develop prototypes.'}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {list.slice(0, 3).map((bot) => (
          <span key={bot.id} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-700">
            {bot.name} <span className="font-normal text-slate-400">· {getProjectName(bot.projectId, projects)}</span>
          </span>
        ))}
        {!list.length && <span className="text-xs text-slate-400">No bots added yet</span>}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">{list.reduce((sum, bot) => sum + tasks.filter((task) => task.robotId === bot.id && task.status !== 'Done').length, 0)} active tasks</p>
    </button>
  );
}

function RobotGrid({ type, robots, projects, tasks }: { type: RobotType; robots: Robot[]; projects: Project[]; tasks: Task[] }) {
  const list = robots.filter((bot) => bot.type === type);
  if (!list.length) return <EmptyState text="No bots in this track yet. Add one to start organizing the work." />;
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {list.map((bot) => {
        const botTasks = tasks.filter((task) => task.robotId === bot.id);
        return (
          <article key={bot.id} className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div className={`rounded-xl p-2.5 ${type === 'Competition' ? 'bg-violet-50 text-violet-700' : 'bg-cyan-50 text-cyan-700'}`}><Bot className="h-5 w-5" /></div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{botTasks.filter((task) => task.status !== 'Done').length} open tasks</span>
            </div>
            <h4 className="mt-4 text-lg font-semibold text-slate-900">{bot.name}</h4>
            <p className="mt-1 text-xs text-slate-500">{getProjectName(bot.projectId, projects)}</p>
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Working on this bot</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {bot.members.length ? bot.members.map((member) => <span key={member} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">{member}</span>) : <span className="text-xs text-slate-400">No members assigned</span>}
              </div>
            </div>
            {botTasks.length > 0 && <p className="mt-3 text-xs text-slate-500">{botTasks.length} task{botTasks.length === 1 ? '' : 's'} tracked</p>}
          </article>
        );
      })}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-slate-200 px-5 py-10 text-center text-sm text-slate-500">{text}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>{children}</label>;
}

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100';
const primaryButtonClass = 'rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40';
const cancelButtonClass = 'rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100';

function FormActions({ onCancel }: { onCancel: () => void }) {
  return <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={onCancel} className={cancelButtonClass}>Cancel</button><button type="submit" className={primaryButtonClass}>Create</button></div>;
}

function ProjectForm({ onSubmit, onCancel }: { onSubmit: (name: string, description: string) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (name.trim()) onSubmit(name.trim(), description.trim()); };
  return <form onSubmit={submit} className="space-y-4"><FormField label="Project name"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Summer robotics challenge" className={inputClass} /></FormField><FormField label="What is this project about?"><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Add a short description..." className={inputClass} /></FormField><FormActions onCancel={onCancel} /></form>;
}

function RobotForm({ projects, onSubmit, onCancel }: { projects: Project[]; onSubmit: (name: string, type: RobotType, projectId: string, members: string[]) => void; onCancel: () => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<RobotType>('Competition');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [members, setMembers] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (name.trim() && projectId) onSubmit(name.trim(), type, projectId, members.split(',').map((member) => member.trim()).filter(Boolean)); };
  return <form onSubmit={submit} className="space-y-4"><FormField label="Bot name"><input required autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Atlas Mk II" className={inputClass} /></FormField><FormField label="Track"><select value={type} onChange={(event) => setType(event.target.value as RobotType)} className={inputClass}><option>Competition</option><option>Research & Development</option></select></FormField><FormField label="Project"><select required value={projectId} onChange={(event) => setProjectId(event.target.value)} className={inputClass}><option value="" disabled>Select a project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>{projects.length === 0 && <span className="mt-1 block text-xs text-rose-600">Create a project first.</span>}</FormField><FormField label="Team members"><input value={members} onChange={(event) => setMembers(event.target.value)} placeholder="Names separated by commas" className={inputClass} /></FormField><FormActions onCancel={onCancel} /></form>;
}

function TaskForm({ robots, onSubmit, onCancel }: { robots: Robot[]; onSubmit: (title: string, robotId: string, assignee: string, dueDate: string) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [robotId, setRobotId] = useState(robots[0]?.id ?? '');
  const [assignee, setAssignee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const submit = (event: FormEvent) => { event.preventDefault(); if (title.trim() && robotId) onSubmit(title.trim(), robotId, assignee.trim(), dueDate); };
  return <form onSubmit={submit} className="space-y-4"><FormField label="Task"><input required autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs to get done?" className={inputClass} /></FormField><FormField label="Robot"><select required value={robotId} onChange={(event) => setRobotId(event.target.value)} className={inputClass}><option value="" disabled>Select a robot</option>{robots.map((robot) => <option key={robot.id} value={robot.id}>{robot.name} · {robot.type}</option>)}</select>{robots.length === 0 && <span className="mt-1 block text-xs text-rose-600">Add a robot first.</span>}</FormField><div className="grid gap-4 sm:grid-cols-2"><FormField label="Assigned to"><input value={assignee} onChange={(event) => setAssignee(event.target.value)} placeholder="Member name" className={inputClass} /></FormField><FormField label="Due date"><input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} className={inputClass} /></FormField></div><FormActions onCancel={onCancel} /></form>;
}

function getRobotName(id: string, robots: Robot[]) {
  return robots.find((robot) => robot.id === id)?.name ?? 'Unknown bot';
}

function getProjectName(id: string, projects: Project[]) {
  return projects.find((project) => project.id === id)?.name ?? 'Unassigned project';
}

function statusClass(status: TaskStatus) {
  if (status === 'Done') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Needs review') return 'bg-violet-50 text-violet-700';
  if (status === 'In progress') return 'bg-cyan-50 text-cyan-800';
  return 'bg-slate-100 text-slate-600';
}
