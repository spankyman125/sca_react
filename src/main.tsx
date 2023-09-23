import 'scrollbars.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ReactDOM from 'react-dom/client';
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import App from './components/App/App';
import Auth from './components/Auth/Auth';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// ie11 polyfills
// import 'whatwg-fetch';
// import 'abortcontroller-polyfill';
// import { configure } from 'mobx';
// configure({
//   useProxies: 'ifavailable',
// });
// ie11 polyfills

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" errorElement={<NotFound />}>
      <Route
        path=""
        element={<Navigate to="/auth" />}
        errorElement={<NotFound />}
      />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="app"
        element={
          <ProtectedRoute>
            <App />
          </ProtectedRoute>
        }
      >
        <Route path="rooms/:roomId" element={null}></Route>
      </Route>
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>,
  // </React.StrictMode>,
);
