import api from "./api/axios";

export function getAttendance(params) {
  return api.get("/attendance", { params });
}

export function getDevices() {
  return api.get("/devices");
}

export function enrollEmployee(payload) {
  return api.post("/enroll", payload);
}

