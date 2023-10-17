import { useLocation, Link } from 'react-router-dom';

import styles from './header.module.scss';

const Header = () => {
    const location = useLocation();

    const routes = [
        { name: 'Contacts', path: '/'},
        { name: 'Projects', path: '/projects'},
        { name: 'Skills', path: '/skills'},
        { name: 'Categories', path: '/categories'},
    ];

    const routeElements = routes.map(e => (
        <Link 
            style={e.path === location.pathname ? { fontWeight: 500 } : {}}
            to={e.path}
        >{e.name}</Link>
    ));

    return (
        <header className={styles.header}>
            <strong>Portfolio Manager</strong>
            <nav>
                {routeElements}
            </nav>
        </header>
    )
}

export default Header;