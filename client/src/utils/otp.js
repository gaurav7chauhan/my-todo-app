export const otpRequest = async ({ email, username, password, type }) => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password, type }),
    });
    const result = await res.json();
    return { ok: res.ok, result };
  } catch (error) {
    return { ok: false, result: { message: error.message } };
  }
};
