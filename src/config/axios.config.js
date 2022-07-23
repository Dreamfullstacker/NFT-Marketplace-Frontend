import axios from "axios";

export function axiosConfig(token)
{
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
