import api from "./api";

/* Get full employee profile */
export async function getEmployeeProfile(employee_id) {
  const res = await api.get(`/api/employees/${employee_id}`);
  return res?.data || res;
}

/* Update employee self profile */
export async function updateEmployeeProfile(employee_id, body) {
  const res = await api.put(`/api/employees/${employee_id}`, body);
  return res?.data || res;
}

export default {
  getEmployeeProfile,
  updateEmployeeProfile,
};
