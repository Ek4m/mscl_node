const SuccessResponse = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: statusCode,
    messages: [],
    data,
  });
};

const ErrorResponse = (res, messages, statusCode = 500) => {
  return res.status(statusCode).json({
    status: statusCode,
    data:null,
    messages: messages
      ? Array.isArray(messages)
        ? messages
        : [messages]
      : ["An error occurred"],
  });
};

module.exports = {
  SuccessResponse,
  ErrorResponse,
};
