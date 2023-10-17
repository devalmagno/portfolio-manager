import { Dispatch, SetStateAction, useState } from 'react';
import {
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore';
import {
    BiSolidContact,
    BiPlusCircle,
    BiSolidEdit,
    BiSend,
    BiUndo,
    BiTrash
} from 'react-icons/bi';
import { AiOutlineClose } from 'react-icons/ai';

import colors from '../../styles/colors.module.scss';

import styles from './contactcard.module.scss';
import IContact from '../../types/Contact';
import { db } from '../../lib/firebaseConfig';

interface Props {
    contact: IContact;
    contacts: IContact[];
    setContacts: Dispatch<SetStateAction<IContact[]>>;
}

const ContactCard = ({ contact, contacts, setContacts }: Props) => {
    const [name, setName] = useState(contact.name);
    const [email, setEmail] = useState(contact.email);
    const [phone, setPhone] = useState(contact.phone);
    const [orders, setOrders] = useState(contact.orders);

    const [isEditable, setIsEditable] = useState(false);

    const handleUpdateContact = async () => {
        if (email === '' && phone === '') return;
        if (name === contact.name &&
            email === contact.email &&
            phone === contact.phone &&
            orders === contact.orders) return;

        try {
            const contactsRef = doc(db, 'contacts', contact.id);
            await updateDoc(contactsRef, {
                name,
                email,
                phone,
                orders,
            });

            const updatedContact: IContact = { id: contact.id, name, email, phone, orders };
            const contactList: IContact[] = contacts;
            let index = 0;
            contactList.forEach((e, i) => {
                if (e.id === contact.id) index = i;
            });
            contactList.splice(index, 1);
            setContacts([updatedContact, ...contactList]);
       } catch (error) {
            console.log(error);
        }

        setIsEditable(false);
    }

    const handleDeleteContact = async () => {
        const confirm = window.confirm("Tem certeza que deseja deletar este contato?");
        if (!confirm) return;

        try {
            const contactRef = doc(db, "contacts", contact.id);
            await deleteDoc(contactRef);

            const contactList: IContact[] = [...contacts];
            let index = 0;
            contactList.forEach((e, i) => {
                if (e.id === contact.id) index = i;
            });
            contactList.splice(index, 1);
            setContacts(contactList);
        } catch (error) {
            console.log(error);
        }
    }

    const handleUndo = () => {
        setName(contact.name);
        setEmail(contact.email);
        setPhone(contact.phone);
        setOrders(contact.orders);
    }

    return (
        <div className={styles.container}>
            <BiSolidContact fill={isEditable ? colors.enabled : colors.disabled} size={24} />
            <div className={styles.info}>
                <input
                    type="text"
                    placeholder='Client Name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly={!isEditable}
                />
                <input
                    type="email"
                    placeholder='Client E-mail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly={!isEditable}
                />
                <input
                    type="text"
                    placeholder='Client Phone Number'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={!isEditable}
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
                {isEditable ? (
                    <>
                        <button
                            className={styles.btnIcon}
                            onClick={handleUpdateContact}
                        >
                            <BiSend fill={colors.enabled} size={18} />
                        </button>
                        <button
                            className={styles.btnIcon}
                            onClick={handleUndo}
                        >
                            <BiUndo fill={colors.enabled} size={18} />
                        </button>
                        <button
                            className={styles.btnIcon}
                            onClick={() => setIsEditable(false)}
                        >
                            <AiOutlineClose fill={colors.enabled} size={18} />
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className={styles.btnIcon}
                            onClick={() => setIsEditable(prevState => !prevState)}
                        >
                            <BiSolidEdit fill={colors.enabled} size={18} />
                        </button>
                        <button
                            className={styles.btnIcon}
                            onClick={handleDeleteContact}
                        >
                            <BiTrash fill={colors.enabled} size={18} />
                        </button>
                    </>
                )}
            </div>
        </div >
    )
}

export default ContactCard;