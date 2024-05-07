export interface Schedule {
  dailySchedules: Map<string, DailySchedule>;
}

interface DailySchedule {
  startTime: string;
  endTime: string;
}
