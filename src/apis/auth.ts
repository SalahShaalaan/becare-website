// import api from "./axios";

// export async function login(email, password) {
//   try {
//     const response = await api.post("/auth/login", {
//       email,
//       password,
//     });
//     return response.data.accessToken;
//   } catch (err) {
//     throw new Error(err.response?.data?.message);
//   }
// }

// export async function logout() {
//   try {
//     await api.post("/auth/logout");
//   } catch (err) {
//     throw new Error(err.response?.data?.message);
//   }
// }

// export async function register(
//   first_name,
//   last_name,
//   username,
//   email,
//   phone,
//   password
// ) {
//   try {
//     console.log(first_name);
//     console.log(last_name);
//     console.log(username);
//     console.log(email);
//     console.log(phone);
//     console.log(password);
//     const res = await api.post("/auth/register", {
//       first_name,
//       last_name,
//       username,
//       email,
//       phone,
//       password,
//       role: "user",
//     });
//     console.log(res);
//   } catch (err) {
//     console.log(err);
//     throw new Error(err.response?.data?.message);
//   }
// }


import { AxiosError } from 'axios';
import api from "./axios";

interface LoginResponse {
  accessToken: string;
}

interface RegisterPayload {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

interface ErrorResponse {
  message: string;
}

export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await api.post<LoginResponse>("http://newinsu.site/api", {
      email,
      password,
    });
    return response.data.accessToken;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
}

export async function register(
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  phone: string,
  password: string
): Promise<void> {
  try {
    const payload: RegisterPayload = {
      first_name,
      last_name,
      username,
      email,
      phone,
      password,
      role: "user",
    };
    
    const res = await api.post("/auth/register", payload);
    console.log(res);
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    console.log(error);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}
