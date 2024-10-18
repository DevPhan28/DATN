type Iuser = {
  id: number;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};
type Ilogin = {
  _id: string;
  email: string;
  password: string;
  user: string[];
};
