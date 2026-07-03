export type PlatformSettings = {
  daily_ad_limit: number;
  daily_ip_ad_limit: number;
  ad_cooldown_seconds: number;
  daily_social_task_limit: number;
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  daily_ad_limit: 20,
  daily_ip_ad_limit: 20,
  ad_cooldown_seconds: 90,
  daily_social_task_limit: 5,
};

export const SOCIAL_TASK_REWARDS: Record<string, number> = {
  "task-ig-1": 250,
  "task-tt-1": 350,
  "task-yt-1": 500,
  "task-x-1": 300,
  "task-tg-1": 400,
  "task-wa-1": 600,
};
