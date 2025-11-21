export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("access_token");
  return !!token;
};

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  window.location.href = "/hero";
};