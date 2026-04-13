export interface PlanningEvent {
  _id: string;
  title: string;
  date?: string;
  day?: string;
  duration: {
    start: string;
    end: string;
  };
  location: string;
  person: string;
}
