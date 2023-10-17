import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useAuthContext } from './contexts/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Categories from './pages/Categories';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        children: [
            {
                path: '/projects',
                element: <Projects />
            },
            {
                path: '/skills',
                element: <Skills />
            },
            {
                path: '/categories',
                element: <Categories />
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    }
]);

const loginRouter = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
])

export default function Router() {
    const { userIsEnabled } = useAuthContext();

    return (
        <RouterProvider router={userIsEnabled ? router : loginRouter} />
    );
}