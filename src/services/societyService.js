import api from "../api/axios";

export const createSociety = async (payload) => {
  try {
    const response = await api.post("/group/", {
      name: payload.name,
      description: payload.description,
      entranceFee: payload.entranceFee,
    });
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

export const updateSociety = async (payload) => {
  try {
    const {societyId}  = payload
    delete payload.societyId
    const response = await api.put(`/group/${societyId}/update`, {
      name: payload.name,
      description: payload.description,
      entranceFee: payload.entranceFee,
      isActive: payload.isActive,
    });
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

export const getSocieties = async () => {
  try {
    const response = await api.get("/group/");
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

export const getSociety = async (id) => {
  try {
    const response = await api.get(`/group/single/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      error.message = "No response received from server.";
    } else {
      error.message = `${error.message}`;
    }
    throw error;
  }
};

export const getSocietyDetail = async (id) => {
  try {
    const response = await api.get(`/group/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      error.message = `${
        error.response.data.error || error.response.statusText
      }`;
    } else if (error.request) {
      error.message = "No response received from server.";
    } else {
      error.message = `${error.message}`;
    }
    throw error;
  }
};



export const getSocietyMembers = async (id) => {
  try {
    const response = await api.get(`/group/${id}/members`);
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

export const createContribution = async (payload) => {
  const groupId = payload.groupId;
  delete payload.groupId
  try {
    const response = await api.post(`/group/${groupId}/contribution/create`, payload);
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

export const getContributions = async (groupId) => {
  try {
    const response = await api.get(`/group/${groupId}/contributions`);
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

export const getContributionThrifts = async (programId) => {
  try {
    const response = await api.get(`/group/contributions/${programId}/thrifts`);
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

export const updateContribution = async (payload) => {
  const id = payload.id;
  delete payload.id
  try {
    const response = await api.post(`/group//contribution/${id}/update`, payload);
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


export const deleteContribution = async (payload) => {
  const id = payload.id;
  try {
    const response = await api.delete(`/group/contribution/${id}/delete`);
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


export const updateThriftSettings = async (groupId, payload) => {
  try {
    const response = await api.post(`/admin/${groupId}/thrift-settings`, payload);
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