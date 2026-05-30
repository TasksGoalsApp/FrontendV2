import { Briefcase, Camera, GraduationCap, House, ShoppingBag } from 'lucide-react'

import type { Goal } from './types'

export const GOALS_IN_PROGRESS: Goal[] = [
  {
    id: 'ig',
    time: '09:05 AM',
    icon: Camera,
    color: 'periwinkle',
    title: 'Instagram Post Update',
    sub: 'Social media',
    due: 'Today, 17:00 PM',
    target: 'Engagement',
    status: 'Active',
    start: '01 Dec, 22',
    end: 'Today',
    pct: 35,
    series: [12, 18, 15, 22, 19, 28, 24, 31, 35],
  },
  {
    id: 'android',
    time: '09:05 AM',
    icon: GraduationCap,
    color: 'lime',
    title: 'Android Studio Course',
    sub: 'Learning',
    due: '25 Dec, 2022',
    target: 'Intermediate Level',
    status: 'Active',
    start: '30 Oct, 22',
    end: '25 Dec, 22',
    pct: 80,
    series: [30, 38, 35, 46, 52, 49, 61, 70, 80],
  },
  {
    id: 'biz',
    time: '09:05 AM',
    icon: Briefcase,
    color: 'cyan',
    title: 'Business Improvement',
    sub: 'Business',
    due: '28 Dec, 2022',
    target: 'Sales target',
    status: 'Active',
    start: '12 Nov, 22',
    end: '28 Dec, 22',
    pct: 54,
    series: [20, 26, 31, 29, 38, 44, 41, 50, 54],
  },
]

export const GOALS_DONE: Goal[] = [
  {
    id: 'home',
    time: '09:05 AM',
    icon: House,
    color: 'periwinkle',
    title: 'Home Interior Design',
    sub: 'Property',
    due: '08 Nov, 2022',
    target: 'Interior Stuff',
    status: 'Completed',
    start: '01 Sep, 22',
    end: '08 Nov, 22',
    pct: 100,
    series: [40, 52, 60, 71, 78, 86, 92, 97, 100],
  },
  {
    id: 'nike',
    time: '09:05 AM',
    icon: ShoppingBag,
    color: 'cyan',
    title: 'Nike Air Jordan Shoe',
    sub: 'Fashion shopping',
    due: '25 Oct, 2022',
    target: 'Upgrade Style',
    status: 'Completed',
    start: '10 Oct, 22',
    end: '25 Oct, 22',
    pct: 100,
    series: [55, 63, 70, 76, 84, 90, 95, 98, 100],
  },
]

export const ALL_GOALS: Goal[] = [...GOALS_IN_PROGRESS, ...GOALS_DONE]

export const SUMMARY_CELLS = [
  { label: 'Goal', value: 'This month' },
  { label: 'Goal', value: '8 Goal' },
  { label: 'Due date', value: '30 Nov, 2022' },
  { label: 'Goal achieve', value: '4 Achievement' },
]
