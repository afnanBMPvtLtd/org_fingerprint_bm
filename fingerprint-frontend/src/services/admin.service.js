import api from "./api/axios";

export function createOrganization(payload) {
  return api.post("/organizations", payload);
}

export function getOrganizations() {
  return api.get("/organizations");
}

