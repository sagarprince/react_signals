import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import useAuth from './shared/hooks/useAuth';
import * as ROUTES from './constants/routes';

// Pages
const LoginPage = lazy(() => import('./pages/Login/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUp/SignUpPage'));

import Home from './pages/Home/Home';
const DashboardPage = lazy(() => import('./pages/Dashboard/DashboardPage'));
const ContactsPage = lazy(() => import('./pages/Contacts/ContactsPage'));
const AddEditContactPage = lazy(() => import('./pages/Contacts/AddEditContact/AddEditContactPage'));
const CampaignsPage = lazy(() => import('./pages/Campaigns/CampaignsPage'));
const AddEditCampaignPage = lazy(() => import('./pages/Campaigns/AddEditCampaign/AddEditCampaignPage'));
const EmailTemplatesPage = lazy(() => import('./pages/EmailTemplates/EmailTemplatesPage'));

import NotFound from './pages/NotFound/NotFound';

import { FallbackRoutingError } from './shared/components/FallbackError/FallbackError';

// Context Providers
import { AuthProvider } from './shared/contexts/AuthContext';
import { AppProvider } from './shared/contexts/AppContext';
import { ContactsProvider } from './shared/contexts/ContactsContext';
import { CampaignsProvider } from './shared/contexts/CampaignsContext';

function RequiredAuthRoute({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}

function AuthenticatedRoute({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  if (auth.user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

export default function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<h1>Loading....</h1>}>
          <ErrorBoundary fallbackRender={FallbackRoutingError}>
            <Routes>
              <Route
                path={ROUTES.HOME}
                element={
                  <RequiredAuthRoute>
                    <AppProvider>
                      <ContactsProvider>
                        <Home />
                      </ContactsProvider>
                    </AppProvider>
                  </RequiredAuthRoute>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<>Loading Dashboard...</>}>
                      <DashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path={ROUTES.CONTACTS}
                  element={
                    <Suspense fallback={<>Loading Contacts...</>}>
                      <ContactsPage />
                    </Suspense>
                  }
                />
                <Route
                  path={ROUTES.ADD_CONTACT}
                  element={
                    <Suspense fallback={<>Loading...</>}>
                        <AddEditContactPage mode='ADD' />
                    </Suspense>
                  }
                />
                <Route
                  path={ROUTES.EDIT_CONTACT}
                  element={
                    <Suspense fallback={<>Loading...</>}>
                      <AddEditContactPage mode='EDIT' />
                    </Suspense>
                  }
                />
                <Route
                  path={ROUTES.CAMPAIGNS}
                  element={
                    <Suspense fallback={<>Loading Campaigns...</>}>
                      <CampaignsProvider>
                        <CampaignsPage />
                      </CampaignsProvider>
                    </Suspense>
                  }
                />
                <Route
                  path={ROUTES.ADD_CAMPAIGN}
                  element={
                    <Suspense fallback={<>Loading...</>}>
                      <CampaignsProvider>
                        <AddEditCampaignPage mode='ADD' />
                      </CampaignsProvider>
                    </Suspense>
                  }
                />
                <Route
                  path={ROUTES.EDIT_CAMPAIGN}
                  element={
                    <Suspense fallback={<>Loading...</>}>
                      <CampaignsProvider>
                        <AddEditCampaignPage mode='EDIT' />
                      </CampaignsProvider>
                    </Suspense>
                  }
                />
                <Route
                  path={ROUTES.TEMPLATES}
                  element={
                    <Suspense fallback={<>Loading Templates...</>}>
                      {/* <ContactsProvider> */}
                      <EmailTemplatesPage />
                      {/* </ContactsProvider> */}
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path={ROUTES.LOGIN}
                element={
                  <AuthenticatedRoute>
                    <LoginPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path={ROUTES.SIGN_UP}
                element={
                  <AuthenticatedRoute>
                    <SignUpPage />
                  </AuthenticatedRoute>
                }
              />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
