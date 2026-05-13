export interface EditProfileData {
  name: string;
  email: string;
  phone: string;
}

export interface ProfileValidationErrors {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
}

export interface ProfileValidationMessages {
  name?: string;
  email?: string;
  phone?: string;
}
