import api from "../api/axios";

/*export const getTransactions = async (dates=null) => {
  try {
   
    const response = dates ? await api.get(`/transaction/group?startDate=${dates.startDate}&endDate=${dates.endDate}`) : await api.get("/transaction/group");
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
};*/

export const getTransactions = async ({ startDate, endDate, page = 1, size = 10, status, society } = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    if (status) queryParams.append("status", status);
    if (society) queryParams.append("society", society);
    queryParams.append("page", page);
    queryParams.append("size", size);

    const response = await api.get(`/transaction/group?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      error.message = error.response.data.error || error.response.statusText;
    } else if (error.request) {
      error.message = "No response received from server.";
    } else {
      error.message = error.message;
    }
    throw error;
  }
};


export const initializeTransaction = async (payload) => {
  try {
    const response = await api.post("/payment/initialize", payload);
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

export const verifyTransaction = async (reference) => {
  try {
    const response = await api.get(`/payment/verify/${reference}`);
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
export const verifyTransactionFund = async (reference) => {
  try {
    const response = await api.get(`/payment/verify-fund/${reference}`);
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
