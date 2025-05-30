import api from "../api/axios";

export const getKycSubmissions = async () => {
     try {
        const response = await api.get("/kyc");
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
}

export const updateKycStatus = async (payload) => {
    try {
        const response = await api.patch(`/kyc/${payload.id}`, payload);
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
}
