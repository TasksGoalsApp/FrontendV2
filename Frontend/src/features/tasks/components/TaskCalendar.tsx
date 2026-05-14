import { useMemo, useState } from 'react';
import type { Task } from '../types/tasks.type';

interface TaskCalendarProps {
  tasks: Task[];
}

export default function TaskCalendar({ tasks }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const firstWeekday = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    const calendarDays: Array<Date | null> = [];

    for (let i = 0; i < firstWeekday; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      calendarDays.push(new Date(year, month, day));
    }

    return calendarDays;
  }, [year, month]);


  const getTasksForDay = (date: Date) => {
    const dateKey = date.toLocaleDateString('en-CA');

    return tasks.filter((task) => task.start_date === dateKey);
  };
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="w-full rounded-lg border bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={goToPreviousMonth} className="rounded border px-3 py-1">
          Previous
        </button>

        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>

        <button onClick={goToNextMonth} className="rounded border px-3 py-1">
          Next
        </button>
      </div>

      <div className="grid grid-cols-7 border-b pb-2 text-center font-medium">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      <div className="grid grid-cols-7">
        {days.map((date, index) => (
          <div key={index} className="min-h-32 border p-2">
            {date && (
              <>
                <div className="mb-2 text-sm font-semibold">
                  {date.getDate()}
                </div>

                <div className="space-y-1">
                  {getTasksForDay(date).map((task) => (
                    <div
                      key={task.task_id}
                      className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                    >
                      {task.task_title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}