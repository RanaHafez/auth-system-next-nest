export type UserLoginType = {
  email: string;
  password: string;
};

export type UserRegisterType = {
  email: string;
  name: string;
  password: string;
};

export type ResetData = {
  token: string;
  password: string;
};
