import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['NextAuth.token']}`
  }
});

api.interceptors.response.use(response => {
  return response;
}, (error: AxiosError) => {
  if (error.response.status) {
    if (error.response.data?.code === 'token.expired') {
      // Refresh token
      cookies = parseCookies();

      const { 'NextAuth.refreshToken': refreshToken } = cookies;

      api.post('/refresh', {
        refreshToken,
      }).then(response => {
        const { token } = response.data;

        setCookie(undefined, 'NextAuth.token', token, {
          maxAge: 60 * 60 * 24 * 30,  // 30 days
          path: '/'
        })

        setCookie(undefined, 'NextAuth.refreshToken', response.data.refreshToken, {
          maxAge: 60 * 60 * 24 * 30,  // 30 days
          path: '/'
        })

        api.defaults.headers['Authorization'] = `Bearer ${token}`
      })
    } else {
      // Log out user
    }
  }
});