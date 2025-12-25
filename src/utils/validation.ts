/**
 * Utilitários de validação
 */

// Validação de CPF
export const validateCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  // Validar dígitos verificadores
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

// Validação de email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de telefone
export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
};

// Validação de idade
export const validateAge = (age: number | string): boolean => {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
  if (isNaN(ageNum)) return false;
  return ageNum >= 16 && ageNum <= 50;
};

// Validação de data futura
export const validateFutureDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj > new Date();
};

// Validação de data passada
export const validatePastDate = (date: string): boolean => {
  const dateObj = new Date(date);
  return dateObj <= new Date();
};

// Validação de tamanho de arquivo (em MB)
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Validação de tipo de arquivo
export const validateFileType = (file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']): boolean => {
  return allowedTypes.includes(file.type);
};

// Validação de nome
export const validateName = (name: string): boolean => {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

// Validação de string não vazia
export const validateRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim().length > 0;
};

// Validação de número inteiro
export const validateInteger = (value: string | number): boolean => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return !isNaN(num) && Number.isInteger(num);
};








