import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DefaultLayout, HavingSidebar } from '~/components/Layouts';
import { Fragment } from 'react';
import ScrollToTop from './ScrollToTop';
import { AppProvider } from './Context/AppContext';
import { publicRoutes, privateRoutes } from '~/routes';
import { OrderContext, OrderContextProvider } from './Context/OrderContext';

function App() {
    const accessToken = localStorage.getItem('access-token');

    return (
        <AppProvider>
            <OrderContextProvider>
                <Router>
                    <ScrollToTop />
                    <div className="App">
                        <Routes>
                            {publicRoutes.map((route, index) => {
                                const Page = route.component;
                                let Layout = DefaultLayout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = Fragment;
                                }

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            !(accessToken && (route.path == '/login' || route.path == '/register')) ? (
                                                <Layout>
                                                    <Page />
                                                </Layout>
                                            ) : (
                                                <Navigate to="/" replace />
                                            )
                                        }
                                    />
                                );
                            })}
                            {privateRoutes.map((route, index) => {
                                const Page = route.component;
                                let Layout = DefaultLayout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = Fragment;
                                }

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            accessToken ? (
                                                <Layout>
                                                    <Page />
                                                </Layout>
                                            ) : (
                                                <Navigate to="/login" replace />
                                            )
                                        }
                                    />
                                );
                            })}
                            return(
                            <Route path="*" element={<Navigate to="/" replace />} />)
                        </Routes>
                    </div>
                </Router>
            </OrderContextProvider>
        </AppProvider>
    );
}

export default App;
