const statusMessage = {
  400: "Unable to analyze the provided URL. Please check that it is valid and accessible.",
  401: "Authentication required. Please log in and try again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  405: "This request method is not supported.",
  408: "The request timed out. Please try again.",
  409: "A conflict occurred while processing the request.",
  413: "The request is too large to process.",
  415: "Unsupported content type.",
  422: "Unable to analyze the provided URL. Please check that it is valid and accessible.",
  429: "Too many requests. Please try again later.",
  500: "Unable to analyze the provided URL. Please check that it is valid and accessible.",
  502: "Unable to analyze the provided URL. Please check that it is valid and accessible.",
  503: "The service is temporarily unavailable. Please try again later.",
  504: "The analysis request timed out. Please try again later.",
};
export default statusMessage 