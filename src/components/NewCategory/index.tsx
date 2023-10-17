import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { } from 'react-icons';

import { db } from '../../lib/firebaseConfig';

import styles from './category.module.scss';
import { addDoc, collection } from 'firebase/firestore';
import { useDataContext } from '../../contexts/DataContext';
import ICategory from '../../types/Category';

const NewCategory = () => {
    const { categories, setCategories } = useDataContext();
    const [name, setName] = useState('');

    const handleCreateCategory = async () => {
        if (name === '') return;

        try {
            const categoriesRef = collection(db, 'categories');
            const { id } = await addDoc(categoriesRef, {
                name,
            });

            const category: ICategory = { id, name };
            setCategories([...categories, category]);

            setName('');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.inputField}>
                <input
                    type="text"
                    placeholder='Enter name of the category'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                
                <button
                    className={styles.btnIcon}
                    onClick={handleCreateCategory}
                >
                    <IoSend fill='#51646E' size={16} />
                </button>
 
            </div>
        </div>
    )
}

export default NewCategory;