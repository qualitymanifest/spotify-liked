const fetchUser = async () => {
  const res = await fetch("/auth/current_user");
  return await res.json();
};

export default fetchUser;
