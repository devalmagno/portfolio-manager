import { Dispatch, SetStateAction, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import {
    BiSolidContact,
    BiPlusCircle,
    BiSend,
    BiUndo
} from 'react-icons/bi';

import { db } from '../../lib/firebaseConfig';

import colors from '../../styles/colors.module.scss';

import styles from './newcontactcard.module.scss';
import IContact from '../../types/Contact';

interface Props {
    contacts: IContact[];
    setContacts: Dispatch<SetStateAction<IContact[]>>;
}

const NewContactCard = ({ setContacts, contacts }: Props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [orders, setOrders] = useState(0);

    const handleCreateContact = async () => {
        if (email === '' && phone === '') return;

        try {
            const contactsRef = collection(db, 'contacts');
            const { id } = await addDoc(contactsRef, {
                name,
                email,
                phone,
                orders,
            });

            const contact: IContact = { id, name, email, phone, orders };
            const contactList: IContact[] = [contact, ...contacts];
            setContacts(contactList);

            setName('');
            setEmail('');
            setPhone('');
            setOrders(0);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUndo = () => {
        setName('');
        setEmail('');
        setPhone('');
        setOrders(0);
    }

    return (
        <div className={styles.container}>
            <BiSolidContact fill={colors.enabled} size={24} />
            <div className={styles.info}>
                <h2>{name !== '' ? `Adding ${name} to your list` : 'New Contact'}</h2>
                <input
                    type="text"
                    placeholder='Enter Client Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder='Enter Client E-mail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder='Enter Client Phone Number'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <div className={styles.orders}>
                    <span>Orders until now: <b>{orders}</b></span>
                    {orders > 0 && (
                        <button
                            className={styles.lessBtn}
                            onClick={() => setOrders(orders - 1)}
                        >-</button>
                    )}
                    <button
                        className={styles.btnIcon}
                        onClick={() => setOrders(orders + 1)}
                    >
                        <BiPlusCircle fill={colors.primary} size={24} />
                    </button>
                </div>
            </div>
            <div className={styles.actions}>
                <button
                    className={styles.btnIcon}
                    onClick={handleCreateContact}
                >
                    <BiSend fill={colors.disbled} size={18} />
                </button>
                <button
                    className={styles.btnIcon}
                    onClick={handleUndo}
                >
                    <BiUndo fill={colors.disbled} size={18} />
                </button>
            </div>
        </div >
    )
}

export default NewContactCard;