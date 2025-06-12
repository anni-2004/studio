// lib/api.ts
const BASE_URL = "http://localhost:8000/profile";

export async function createUserProfile(email: string): Promise<string> {
  const res = await fetch("http://localhost:8000/profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to create profile");
  }

  const data = await res.json();
  return data.userId;
}

export async function saveSection(userId: string, section: string, data: any) {
  const res = await fetch(`${BASE_URL}/${userId}/${section}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || `Failed to save section: ${section}`);
  }
}

export async function submitProfile(userId: string) {
  const res = await fetch(`${BASE_URL}/${userId}/submit`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to submit profile");
  return await res.json();
}

export async function getProfile(userId: string) {
  const res = await fetch(`${BASE_URL}/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return await res.json();
}
