export type CoreCourse = {
  id: string;
  title: string;
  level: "UG" | "S2" | "UG/S2";
};

export type IceCourse = {
  id: string;
  title: string;
  native: string;
  description: string;
  href: string;
  trackId: string;
  note: string;
};

export type CourseLink = {
  id: string;
  title: string;
  href: string;
};

export const coreCourses: CoreCourse[];
export const iceIntro: IceCourse[];
export const iceSeries: IceCourse[];
export const courses: CourseLink[];
