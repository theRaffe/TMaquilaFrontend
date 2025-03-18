import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route } from "react-router-dom";
import "./App.css";
import SessionProvider from "./context/ctx";
import AuthGuard from "./guards/auth.guard";
import { PrivateRoutes, PublicRoutes } from "./models";
import { RoutesWithNotFound } from "./utilities";

const LoginPage = lazy(() => import('./pages/Login/Login'));
const Private = lazy(() => import('./pages/Private/Private'));

function App() {
  return (
    <SessionProvider>
      <div>
        <Suspense
          fallback={
            <>
              <h3>Loading...</h3>
            </>
          }
        >
          <BrowserRouter>
            <RoutesWithNotFound>
              <Route
                path="/"
                element={<Navigate to={PrivateRoutes.PRIVATE} />}
              ></Route>
              <Route path={PublicRoutes.LOGIN} element={<LoginPage />}></Route>
              <Route element={<AuthGuard />}>
                <Route
                  path={`${PrivateRoutes.PRIVATE}/*`}
                  element={<Private />}
                />
              </Route>
            </RoutesWithNotFound>
          </BrowserRouter>
        </Suspense>
      </div>
    </SessionProvider>
  );
}

export default App;
