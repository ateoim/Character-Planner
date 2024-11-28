import { Achievement } from "../types/types";

export const achievements: Achievement[] = [
  {
    id: "first-task",
    title: "Getting Started",
    description: "Complete your first task",
    icon: "🌟",
    condition: (tasks) => tasks.some((task) => task.completed),
    reward: "Unlock basic customization",
  },
  {
    id: "morning-person",
    title: "Morning Person",
    description: "Complete 3 tasks before noon",
    icon: "🌅",
    condition: (tasks) => {
      const morningTasks = tasks.filter((task) => {
        const taskHour = new Date(task.dueDate).getHours();
        return task.completed && taskHour < 12;
      });
      return morningTasks.length >= 3;
    },
    reward: "Morning theme unlocked",
  },
  // Add more achievements as needed
];
