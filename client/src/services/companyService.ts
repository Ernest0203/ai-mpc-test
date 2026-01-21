// Сервис для работы с API компаний
const API_BASE_URL = 'http://localhost:4000';

// Интерфейс для компании
export interface Company {
  _id: string;
  name: string;
  employees: number;
}

// Функция для получения списка компаний
export const fetchCompanies = async (): Promise<Company[]> => {
  const response = await fetch(`${API_BASE_URL}/companies`);
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
};

// Функция для создания новой компании
export const createCompany = async (company: Omit<Company, '_id'>): Promise<Company> => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(company),
  });
  if (!response.ok) {
    throw new Error('Failed to create company');
  }
  return response.json();
};

// Функция для soft delete компании
export const deleteCompany = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete company');
  }
};
