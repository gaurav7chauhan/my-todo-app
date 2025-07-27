import { toast } from "react-toastify";

export const showToast = {
  success: (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  error: (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  info: (message) => {
    toast.info(message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
};

// Specific notification functions for your use cases
export const notifications = {
  // User authentication notifications
  userLoggedIn: (username) => showToast.success(`Welcome back, ${username}!`),
  userLoggedOut: () => showToast.info("Successfully logged out"),
  userRegistered: () => showToast.success("Account created successfully!"),
  otpSent: () => showToast.info("OTP sent to your email"),
  otpResent: () => showToast.info("OTP resent to your email"),
  otpVerified: () => showToast.success("OTP verified successfully"),
  profileUpdated: () => showToast.success("Profile updated successfully"),

  // Todo notifications
  todoCreated: () => showToast.success("Todo created successfully"),
  todoUpdated: () => showToast.success("Todo updated successfully"),
  todoDeleted: () => showToast.success("Todo deleted successfully"),
  todoList: (data) => showToast.success(data),

  // Error notifications
  error: (message) => showToast.error(message || "Something went wrong"),
  networkError: () => showToast.error("Network error. Please try again."),
  unauthorized: () => showToast.error("Unauthorized access. Please login again."),
};
