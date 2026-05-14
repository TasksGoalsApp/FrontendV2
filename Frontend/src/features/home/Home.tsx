export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      
      <h1 className="text-4xl font-bold tracking-tight">
        Welcome to Your Productivity App
      </h1>

      <p className="mt-4 max-w-xl text-muted-foreground">
        Manage your tasks, goals, and habits in one place. Stay organized and
        focused every day.
      </p>

      <div className="mt-8 flex gap-4">
        <a
          href="/tasks"
          className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Go to Tasks
        </a>

        <a
          href="/register"
          className="rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
        >
          Get Started
        </a>
      </div>
    </div>
  )
}