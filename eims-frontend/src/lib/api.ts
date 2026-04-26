import api from './axios';

export default api;

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
export interface School {
  id: string;
  name: string;
  organizationId: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  branches?: Branch[];
}

export interface Branch {
  id: string;
  schoolId: string;
  school?: School;
  name: string;
  city?: string;
  headId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  roles?: Array<{ role: { name: string } }>;
}

export interface ClassRecord {
  id: string;
  branchId: string;
  branch?: Branch;
  name: string;
  gradeLevel?: string;
  createdAt: string;
  updatedAt: string;
  enrollments?: Array<{ studentId: string }>;
}

export interface Subject {
  id: string;
  branchId: string;
  branch?: Branch;
  name: string;
  code?: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Schools
// ──────────────────────────────────────────────
export const schoolsApi = {
  getAll: () => api.get<School[]>('/schools').then(r => r.data),
  getOne: (id: string) => api.get<School>(`/schools/${id}`).then(r => r.data),
  create: (data: { name: string; organizationId: string; address?: string; phone?: string }) =>
    api.post<School>('/schools', data).then(r => r.data),
  update: (id: string, data: Partial<School>) =>
    api.patch<School>(`/schools/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/schools/${id}`).then(r => r.data),
};

// ──────────────────────────────────────────────
// Branches
// ──────────────────────────────────────────────
export const branchesApi = {
  getAll: () => api.get<Branch[]>('/branches').then(r => r.data),
  getOne: (id: string) => api.get<Branch>(`/branches/${id}`).then(r => r.data),
  create: (data: { name: string; schoolId: string; city?: string; headId?: string }) =>
    api.post<Branch>('/branches', data).then(r => r.data),
  update: (id: string, data: Partial<Branch>) =>
    api.patch<Branch>(`/branches/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/branches/${id}`).then(r => r.data),
};

// ──────────────────────────────────────────────
// Organizations
// ──────────────────────────────────────────────
export const organizationsApi = {
  getAll: () => api.get<Organization[]>('/organizations').then(r => r.data),
  create: (data: { name: string; plan?: string }) =>
    api.post<Organization>('/organizations', data).then(r => r.data),
};

// ──────────────────────────────────────────────
// Classes
// ──────────────────────────────────────────────
export const classesApi = {
  getAll: () => api.get<ClassRecord[]>('/classes').then(r => r.data),
  getOne: (id: string) => api.get<ClassRecord>(`/classes/${id}`).then(r => r.data),
  create: (data: { name: string; branchId: string; gradeLevel?: string }) =>
    api.post<ClassRecord>('/classes', data).then(r => r.data),
  update: (id: string, data: Partial<ClassRecord>) =>
    api.patch<ClassRecord>(`/classes/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/classes/${id}`).then(r => r.data),
};

// ──────────────────────────────────────────────
// Subjects
// ──────────────────────────────────────────────
export const subjectsApi = {
  getAll: () => api.get<Subject[]>('/subjects').then(r => r.data),
  getOne: (id: string) => api.get<Subject>(`/subjects/${id}`).then(r => r.data),
  create: (data: { name: string; branchId: string; code?: string }) =>
    api.post<Subject>('/subjects', data).then(r => r.data),
  update: (id: string, data: Partial<Subject>) =>
    api.patch<Subject>(`/subjects/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/subjects/${id}`).then(r => r.data),
};

// ──────────────────────────────────────────────
// Users  (via /users endpoint we'll add to backend)
// ──────────────────────────────────────────────
export const usersApi = {
  getAll: () => api.get<UserRecord[]>('/users').then(r => r.data),
  getOne: (id: string) => api.get<UserRecord>(`/users/${id}`).then(r => r.data),
  create: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<UserRecord>('/users', data).then(r => r.data),
  update: (id: string, data: Partial<UserRecord>) =>
    api.patch<UserRecord>(`/users/${id}`, data).then(r => r.data),
  remove: (id: string) => api.delete(`/users/${id}`).then(r => r.data),
};
