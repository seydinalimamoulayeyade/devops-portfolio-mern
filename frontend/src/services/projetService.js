const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");
const API_URL = `${API_BASE_URL}/projets`;

function getAuthHeaders(withJson = false) {
  const token = localStorage.getItem("token");
  const headers = {};

  if (withJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getMultipartAuthHeaders() {
  const token = localStorage.getItem("token");
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Erreur ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.message) message = data.message;
    } catch {
      // The API may return an empty or non-JSON error body.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getImageUrl(imagePath) {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("/uploads/")) return `${API_ORIGIN}${imagePath}`;
  return imagePath;
}

export async function getAllProjects() {
  const response = await fetch(API_URL);
  return handleResponse(response);
}

export async function deleteProject(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse(response);
  return true;
}

export async function getProjectById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return handleResponse(response);
}

export async function addProject(projectFormData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getMultipartAuthHeaders(),
    body: projectFormData,
  });
  return handleResponse(response);
}

export async function updateProject(id, projectFormData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getMultipartAuthHeaders(),
    body: projectFormData,
  });
  return handleResponse(response);
}
