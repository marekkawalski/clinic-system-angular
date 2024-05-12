export interface Schedule {
  dailySchedules: Map<string, DailySchedule>;
}

export interface DailySchedule {
  startTime: string;
  endTime: string;
}
