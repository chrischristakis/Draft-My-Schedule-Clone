export interface SubjectItem {
  subject: string;
  className: string;
  course_code: string;
  component_info: {
    class_section: string;
    start_time: string;
    end_time: string;
    facility_ID: string;
    campus: string;
    days: string[];
    ssr_component: string;
  }
  expanded:boolean;
}
