import { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { useLocation, Outlet } from 'react-router-dom';

import ContactCard from '../../components/ContactCard';
import Header from '../../components/Header';
import NewContactCard from '../../components/NewContactCard';

import styles from './home.module.scss';
import { db } from '../../lib/firebaseConfig';
import IContact from '../../types/Contact';
import DataProvider from '../../contexts/DataContext';

const Home = () => {
    const [contacts, setContacts] = useState<IContact[]>([]);

    const location = useLocation();
    const isHome = location.pathname === '/';

    const contactElements = contacts.map(contact => (
        <ContactCard
            key={contact.id}
            contact={contact}
            contacts={contacts}
            setContacts={setContacts}
        />
    ));

    useEffect(() => {
        const getContacts = async () => {
            const contactsRef = collection(db, "contacts");
            const data = await getDocs(contactsRef);
            const contactList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }) as IContact);
            setContacts(contactList);
        }

        getContacts();
    }, []);

    return (
        <div className={styles.container}>
            <Header />
            <DataProvider>
                {isHome ? (
                    <main>
                        <section>
                            <NewContactCard setContacts={setContacts} contacts={contacts} />
                        </section>
                        <section>
                            <h2>Contatos</h2>
                            <div className={styles.content}>
                                {contactElements}
                            </div>
                        </section>
                    </main>
                ) : (
                    <Outlet />
                )}
            </DataProvider>
        </div>
    )
}

export default Home;