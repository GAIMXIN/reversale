const apiResponse = (message: string, data: unknown, success: boolean = true) => {
  return {
    success,
    message,
    data,
  };
};

export default apiResponse;
