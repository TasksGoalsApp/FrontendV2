import {
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Dumbbell,
  GraduationCap,
  ListChecks,
  PenTool,
} from 'lucide-react'

import type { FocusGoal, HabitItem, TaskItem } from './types'

export const USER = { name: 'Arriva Elma', first: 'Arriva' }

export const TODAY_TASKS: TaskItem[] = [
  {
    id: 't1',
    time: '09:00',
    title: 'Review auth-service pull request',
    tag: 'Work · Daily Dojo',
    icon: Code,
    color: 'cyan',
    done: true,
  },
  {
    id: 't2',
    time: '11:30',
    title: 'Design review — Today dashboard',
    tag: 'Design',
    icon: PenTool,
    color: 'periwinkle',
    done: false,
  },
  {
    id: 't3',
    time: '14:00',
    title: 'Workout — upper body',
    tag: 'Health',
    icon: Dumbbell,
    color: 'lime',
    done: false,
  },
  {
    id: 't4',
    time: '17:00',
    title: 'Read: Refactoring UI, ch. 4',
    tag: 'Learning',
    icon: BookOpen,
    color: 'periwinkle',
    done: false,
  },
  {
    id: 't5',
    time: '19:30',
    title: "Plan tomorrow's tasks",
    tag: 'Personal',
    icon: ListChecks,
    color: 'cyan',
    done: false,
  },
]

export const TODAY_HABITS: HabitItem[] = [
  { id: 'h1', name: 'Meditate', streak: 12, done: true },
  { id: 'h2', name: 'Read', streak: 7, done: true },
  { id: 'h3', name: 'Workout', streak: 3, done: false },
  { id: 'h4', name: 'Journal', streak: 21, done: false },
  { id: 'h5', name: 'No sugar', streak: 5, done: false },
]

export const FOCUS_GOALS: FocusGoal[] = [
  {
    id: 'android',
    title: 'Android Studio Course',
    category: 'Learning',
    icon: GraduationCap,
    color: 'lime',
    pct: 80,
    series: [30, 38, 35, 46, 52, 49, 61, 70, 80],
  },
  {
    id: 'ig',
    title: 'Instagram Post Update',
    category: 'Social media',
    icon: Camera,
    color: 'periwinkle',
    pct: 35,
    series: [12, 18, 15, 22, 19, 28, 24, 31, 35],
  },
  {
    id: 'biz',
    title: 'Business Improvement',
    category: 'Business',
    icon: Briefcase,
    color: 'cyan',
    pct: 54,
    series: [20, 26, 31, 29, 38, 44, 41, 50, 54],
  },
]
