import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { collection, getDocs } from '@firebase/firestore';

import { auth, db } from '../lib/firebaseConfig';

interface IUser {
    id: string;
    email: string;
}

interface AuthContextType {
    authUser: User | null;
    userIsEnabled: boolean;
    login: () => void;
    logout: () => void;
}

type Props = {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
    const authContext = useContext(AuthContext);

    if (!authContext)
        throw new Error(
            "AuthContext has to be used within <AuthContext.Provider>"
        );

    return authContext;
}

const AuthProvider = (props: Props) => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [userIsEnabled, setUserIsEnabled] = useState(false);
    const [userList, setUserList] = useState<IUser[]>([]);

    const usersCollectionRef = collection(db, "users");

    const login = async () => {

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            setAuthUser(result.user);

            if (userList.length > 0 && userList.some(user => user.email === result.user.email)) {
                setUserIsEnabled(true);
            }
            else logout();
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        // lógica de logout
        signOut(auth).then(() => {
            console.log('sign out sucessful');
        }).catch(err => console.log(err))

        setUserIsEnabled(false);
    };

    useEffect(() => {
        const getUserList = async () => {
            const data = await getDocs(usersCollectionRef);
            const users = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as IUser));
            setUserList(users);
        }

        // const listen = onAuthStateChanged(auth, user => {
        //     if (user) {
        //         setAuthUser(user);
        //         setUserIsEnabled(true);
        //     }
        //     else setAuthUser(null);
        // });

        getUserList();
        // listen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider value={{ authUser, userIsEnabled, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;