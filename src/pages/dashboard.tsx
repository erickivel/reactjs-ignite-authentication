import { useEffect } from "react";
import { Can } from "../components/Can";
import { useAuth } from "../contexts/AuthContext";
import { setupApiClient } from "../services/api";
import { api } from "../services/apiClient";

import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user, signOut } = useAuth();

  useEffect(() => {
    api.get('/me')
      .then(response => {
        console.log(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>

      <button onClick={signOut}>SignOut</button>

      <Can permissions={['metrics.list']} roles={['editor', 'administrator']}>
        <div>Métricas</div>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  // Refreshing token on server side
  const apiClient = setupApiClient(ctx);
  const response = await apiClient.get('/me');

  console.log(response.data);
  return {
    props: {}
  }
}, {});