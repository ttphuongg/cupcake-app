export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

export const isValidEmail = (email: string): boolean => {
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  return phoneRegex.test(phone);
};
