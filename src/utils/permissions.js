export function canReadAttendance(role) {
  return ["admin", "hr", "team_leader", "faculty"].includes(role);
}

export function canWriteAttendance(role) {
  return ["admin", "hr", "team_leader", "faculty"].includes(role);
}
