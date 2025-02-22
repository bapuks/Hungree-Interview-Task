import React, { FC } from "react";
import { Router, RouteComponentProps } from "@reach/router";
import * as routes from "./constants/routes";
import { PageLoading, NoTextLoading } from "./components/util/PageLoading";
import TableSkeleton from "./components/util/TableSkeleton";
import NotFound from "./pages/NotFound";
import Login from "./components/Login";
import { TLogin } from "./hooks/useInitialization";

const Products = React.lazy(() => import("./pages/Products"));
const Orders = React.lazy(() => import("./pages/Orders"));
const Suppliers = React.lazy(() => import("./pages/Suppliers"));
const Sales = React.lazy(() => import("./pages/Sales"));
const Loans = React.lazy(() => import("./pages/Loans"));
const Customers = React.lazy(() => import("./pages/Customers"));
const History = React.lazy(() => import("./pages/History"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Profile = React.lazy(() => import("./pages/Profile"));

interface RoutePageProps extends RouteComponentProps {
  component: FC;
  fallback: FC<any>;
  fbprops?: any;
}

const RoutePage: FC<RoutePageProps> = ({
  component: Component,
  fallback: Fallback,
  fbprops,
  ...rest
}) => (
  <React.Suspense fallback={<Fallback {...fbprops} />}>
    <Component {...rest} />
  </React.Suspense>
);

export const AuthRouter: FC = () => {  
  return (
    <Router primary={false}>
      <RoutePage
        component={Products}
        path={routes.HOME}
        fallback={TableSkeleton}
        fbprops={{ title: "Products" }}
      />
      <RoutePage
        component={Orders}
        path={routes.ORDERS}
        fallback={TableSkeleton}
        fbprops={{ title: "Order" }}
      />
      <RoutePage
        component={Suppliers}
        path={routes.SUPPLIERS}
        fallback={TableSkeleton}
        fbprops={{ title: "Supplier" }}
      />
      <RoutePage
        component={Sales}
        path={routes.SALES}
        fallback={TableSkeleton}
        fbprops={{ title: "Sales" }}
      />
      <RoutePage
        component={Loans}
        path={routes.LOANS}
        fallback={TableSkeleton}
        fbprops={{ title: "Loans" }}
      />
      <RoutePage
        component={Customers}
        path={routes.CUSTOMERS}
        fallback={TableSkeleton}
        fbprops={{ title: "Customers" }}
      />
      <RoutePage
        component={History}
        path={routes.HISTORY}
        fallback={NoTextLoading}
      />
      <RoutePage
        component={Profile}
        path={routes.PROFILE}
        fallback={NoTextLoading}
      />
      <RoutePage
        component={Admin}
        path={routes.ADMIN}
        fallback={NoTextLoading}
      />
      <RoutePage component={NotFound} default fallback={NoTextLoading} />
    </Router>
  );
};

interface NonAuthRouteProps {
  login: TLogin;
}

export const NonAuthRouter: FC<NonAuthRouteProps> = ({ login }) => {
  return (
    <Router primary={false}>
      <NonAuthPage login={login} default />
    </Router>
  );
};

interface NonAuthProps {
  login: TLogin;
  default: boolean;
}

const NonAuthPage: FC<NonAuthProps> = ({ login }) => {
  return <Login doLogin={login} />;
};

interface MainRouterProps {
  loggedIn: boolean;
  loading: boolean;
  isLoaded: boolean;
  message: string;
  login: TLogin;
}

const MainRouter = ({
  loggedIn,
  isLoaded,
  message,
  login
}: MainRouterProps) => {
  if (loggedIn && isLoaded) {
    return <AuthRouter />;
  } else if (loggedIn && !isLoaded) {
    return <PageLoading message={message} />;
  } else {
    return <NonAuthRouter login={login} />;
  }
};

export default MainRouter;
