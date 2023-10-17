import { useAuthContext } from '../../contexts/AuthContext';

import { FcGoogle } from 'react-icons/fc';

import styles from './login.module.scss';

const Login = () => {
    const { login } = useAuthContext();

    return (
        <div className={styles.loginPage}>
            <h3 className={styles.logo}>
                DevAlMagno.com | Portfolio Manager
            </h3>

            <button onClick={login}>
                <div className={styles.googleIcon}>
                    <FcGoogle fill='#fff' />
                </div>
                <span>Entrar com o Google</span>
            </button>
            <div></div>
        </div>
    )
}

export default Login