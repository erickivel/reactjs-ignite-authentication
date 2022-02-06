import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  useEffect(() => {
    api.get('/me').then(response => {
      console.log(response.data);
    })
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>
      <p>{user?.permissions}</p>
      <p>{user?.roles}</p>
    </>
  );
}