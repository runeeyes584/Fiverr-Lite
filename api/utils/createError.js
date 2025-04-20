const createError = (status, message) => {
  const err = new Error();
  err.status = status;
  err.message = message;

  return err;
};

export default createError;
// Tiến bị ngu nên làm cái này để sửa lỗi