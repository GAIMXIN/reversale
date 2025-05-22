export interface SignupData {
  first: string;
  last: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient';
}

export type LoginData = Pick<SignupData, 'email' | 'password'>;
