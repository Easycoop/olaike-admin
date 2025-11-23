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

export const updateLoanSettings = async (groupId, payload) => {
  
    try {
        const response = await api.post(`/admin/update-loan-settings/${groupId}`, payload);
        console.log('loan update response', response)
        return response?.data;
    } catch (error) {
        console.log('loan update error', error)
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

export const getLoanSettings = async (groupId) => {
    try {
        const response = await api.get(`/admin/${groupId}/loan-settings`);
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


export const getUnionSettings = async () => {
    try {
        const response = await api.get(`/admin/union-settings`);
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

export const updateUnionSettings = async (payload) => {
    try {
        const response = await api.post(`/admin/union-settings`, payload);
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

export const updateSystemSettings = async (groupId, payload) => {
    try {
        const response = await api.post(`/admin/update-entrance-fee/${groupId}`, payload);
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