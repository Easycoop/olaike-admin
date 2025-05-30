export const filterColumns = (data, keysToKeep) => {
    return data.map(obj =>
      Object.fromEntries(
        Object.entries(obj).filter(([key]) => keysToKeep.includes(key))
      )
    );
};

const getValueByPath = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };
  
  const setValueByPath = (obj, path, value) => {
    const keys = path.split('.');
    keys.reduce((acc, key, index) => {
      if (index === keys.length - 1) {
        acc[key] = value;
      } else {
        if (!acc[key]) acc[key] = {};
      }
      return acc[key];
    }, obj);
  };

  export const filterNestedFields = (data, fieldsToKeep) => {
    return data.map(item => {
      const filteredItem = {};
      fieldsToKeep.forEach(fieldPath => {
        const value = getValueByPath(item, fieldPath);
        if (value !== undefined) {
          setValueByPath(filteredItem, fieldPath, value);
        }
      });
      return filteredItem;
    });
  };