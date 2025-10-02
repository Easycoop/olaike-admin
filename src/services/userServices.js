import api from "../api/axios";

export const getUsers = async (page, size=10) => {
  try {
    const response = await api.get(`/user/group?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Add server response details to the error
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Add request details to the error
      error.message = "No response received from server.";
    } else {
      // Add request setup details to the error
      error.message = `${error.message}`;
    }
    throw error;
  }
};

export const getUser = async (id) => {
  try {
    const response = await api.get(`/user/user/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Add server response details to the error
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Add request details to the error
      error.message = "No response received from server.";
    } else {
      // Add request setup details to the error
      error.message = `${error.message}`;
    }
    throw error;
  }
};

export const updateUser = async (payload) => {
  try {
    const response = await api.put(`/user/`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Add server response details to the error
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Add request details to the error
      error.message = "No response received from server.";
    } else {
      // Add request setup details to the error
      error.message = `${error.message}`;
    }
    throw error;
  }
};

export const createUsers = async (payload) => {
  try {
    const response = await api.post("/user/", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Add server response details to the error
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Add request details to the error
      error.message = "No response received from server.";
    } else {
      // Add request setup details to the error
      error.message = `${error.message}`;
    }
    throw error;
  }
};

export const assignRole = async (payload) => {
  try {
    const response = await api.post("/user/assign-role", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Add server response details to the error
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Add request details to the error
      error.message = "No response received from server.";
    } else {
      // Add request setup details to the error
      error.message = `${error.message}`;
    }
    throw error;
  }
};

export const batchOnboarding = async (payload) => {
  try{
    const response = await api.post('/admin/batch-onboarding', payload, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data
  } catch(error){
    if (error.response) {
      // Add server response details to the error
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      // Add request details to the error
      error.message = "No response received from server.";
    } else {
      // Add request setup details to the error
      error.message = `${error.message}`;
    }
    throw error;
  }
}