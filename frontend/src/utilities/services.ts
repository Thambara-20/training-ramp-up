import axios from "axios";
import { GridValidRowModel } from "@mui/x-data-grid";
const url = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log(
        "Access token expired. Refreshing...",
        originalRequest._retry
      );
      originalRequest._retry = true;

      try {
        await axios.post(
          `${url}/users/refreshtoken`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log("Token refreshed successfully");

        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const fetchStudentsAsync = async () => {
  try {
    const response = await axiosInstance.get(`${url}/students`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addStudentsAsync = async (data: GridValidRowModel) => {
  try {
    const response = await axiosInstance.post(
      `${url}/students/${data.socketId}`,
      data.editedRow,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateStudentAsync = async (data: GridValidRowModel) => {
  try {
    const response = await axiosInstance.put(
      `${url}/students/${data.editedRow.id}/${data.socketId}`,
      data.editedRow,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStudentAsync = async (data: any) => {
  try {
    const response = await axiosInstance.delete(
      `${url}/students/${data.id}/${data.socketId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginAsync = async (newuser: any) => {
  try {
    const response: any = await axios.post(`${url}/users/login`, newuser, {
      withCredentials: true,
    });
    console.log("response", response);

    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const addUsersAsync = async (data: any) => {
  try {
    const newuser = {
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    };
    const response = await axiosInstance.post(
      `${url}/users/email/${data.socketId}`,
      newuser,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const asyncAuthenticateUser = async () => {
  try {
    const temp = {
      token: "token",
    };
    const response = await axiosInstance.post(`${url}/users/verify`, temp, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signupUsersAsync = async (data: any) => {
  try {
    const body = {
      token: data.token,
      password: data.password,
    };
    const response = await axios.post(`${url}/users/signup`, body, {});
    console.log("response", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUsersAsync = async (data: any) => {
  try {
    const response = await axios.post(`${url}/users/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutAsync = async () => {
  try {
    const response = await axiosInstance.post(
      `${url}/users/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log("response", response.data);
    return response.data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
