import { AppState, Payload } from "../../../interfaces/AdminReducerTypes";
import { ReportObject } from "../../../interfaces/Reports";

export function sortedReports(
  state: AppState,
  payload: Payload
): ReportObject[] | string {
  const { orderBy, order } = payload;
  if (order && orderBy) {
    const sorted: ReportObject[] = sortReports(
      state.displayReports,
      order,
      orderBy
    );
    if (sorted.length > 0) {
      return sorted;
    } else {
      return "Error";
    }
  }
  return "Error";
}
function sortReports(
  reports: ReportObject[],
  order: "asc" | "desc",
  orderBy: string
): ReportObject[] {
  if (orderBy === "reportedOn") {
    const sortedReports = reports.sort(
      (a: ReportObject, b: ReportObject): number => {
        if (order === "asc") {
          return (
            new Date(a[orderBy]).getTime() - new Date(b[orderBy]).getTime()
          );
        } else {
          return (
            new Date(b[orderBy]).getTime() - new Date(a[orderBy]).getTime()
          );
        }
      }
    );
    return sortedReports;
  } else {
    return reports;
  }
}

export function filterReportsType(
  state: AppState,
  payload: Payload
): ReportObject[] {
  const filter: undefined | string = payload.filter;
  if (filter) {
    console.log(filter);
    const filtered: ReportObject[] = state.reports.filter(
      (report: ReportObject): boolean =>
        report.type.toLowerCase().includes(filter.toLowerCase())
    );
    console.log(filtered);
    return filtered;
  }
  return state.reports;
}

export function removeReport(state: AppState, payload: Payload) {
  const id: undefined | string = payload.id;
  if (id) {
    const removed: ReportObject[] = state.reports.filter(
      (report: ReportObject): boolean => {
        return report._id !== id;
      }
    );
    return removed;
  }
  return "Error";
}
