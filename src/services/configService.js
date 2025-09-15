import api from "../api/axios";

export const getAppConfig = async () => {
    try {
        const response = await api.get("/config");
        return response?.data;
    } catch (error) {
        if (error.response) {
            error.message = `${ error.response.data.error || error.response.statusText }`;
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

export const updateLoanSettings = async (payload) => {
    try {
        const response = await api.post(`/admin/update-loan-settings`, payload);
        return response?.data;
    } catch (error) {
        if (error.response) {
            error.message = `${ error.response.data.error || error.response.statusText }`;
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

export const getLoanSettings = async () => {
    try {
        const response = await api.get(`/admin/loan-settings`);
        console.log(response);
        return response?.data;
    } catch (error) {
        console.log(error)
        if (error.response) {
            error.message = `${ error.response.data.message || error.response.data.error || error.response.statusText }`;
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