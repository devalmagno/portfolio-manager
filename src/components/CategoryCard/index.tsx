import { useState } from 'react';
import { BiSolidEdit, BiTrash } from 'react-icons/bi';
import { IoSend } from 'react-icons/io5';

import { useDataContext } from '../../contexts/DataContext';

import ICategory from '../../types/Category';

import styles from './skill.module.scss';

interface Props {
    category: ICategory;
    index: number;
}

const CategoryCard = ({ category, index }: Props) => {
    const { categories, setCategories } = useDataContext();
    const [name, setName] = useState(category.name);

    const [isEditable, setIsEditable] = useState(false);

    const handleUpdate = async () => {
        // if (name === '') return;

        // try {
        //     const skillsRef = collection(db, 'skills');
        //     const { id } = await addDoc(skillsRef, {
        //         name,
        //     });

        //     const skill: ISkill = { id, name };
        //     setSkills([...skills, skill]);

        //     setName('');
        // } catch (error) {
        //     console.log(error);
        // }
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

                {isEditable ? (
                    <div className={styles.actions}>
                        <button
                            className={styles.btnIcon}
                            onClick={handleUpdate}
                        >
                            <IoSend fill='#51646E' size={16} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.actions}>
                        <button
                            className={styles.btnIcon}
                        >
                            <BiTrash fill='#51646E' size={16} />
                        </button>
                        <button
                            className={styles.btnIcon}
                            onClick={() => setIsEditable(true)}
                        >
                            <BiSolidEdit fill='#51646E' size={16} />
                        </button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default CategoryCard;