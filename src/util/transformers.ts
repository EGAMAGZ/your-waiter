export const formDataToJson = (formData: FormData) =>
  JSON.stringify(Object.fromEntries(formData.entries()));
