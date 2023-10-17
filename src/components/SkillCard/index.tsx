import { useState } from 'react';

import { BiSolidEdit, BiTrash } from 'react-icons/bi';
import { IoSend } from 'react-icons/io5';

import { db } from '../../lib/firebaseConfig';

import styles from './skill.module.scss';
import { addDoc, collection } from 'firebase/firestore';
import ISkill from '../../types/Skill';
import { useDataContext } from '../../contexts/DataContext';

interface Props {
    skill: ISkill;
    index: number;
}

const NewSkill = ({ skill, index }: Props) => {
    const { skills, setSkills } = useDataContext();
    const [name, setName] = useState(skill.name);

    const [isEditable, setIsEditable] = useState(false);

    const handleCreateSkill = async () => {
        if (name === '') return;

        try {
            const skillsRef = collection(db, 'skills');
            const { id } = await addDoc(skillsRef, {
                name,
            });

            const skill: ISkill = { id, name };
            setSkills([...skills, skill]);

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
                    placeholder='Enter name of the skill'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                {isEditable ? (
                    <div className={styles.actions}>
                        <button
                            className={styles.btnIcon}
                            onClick={handleCreateSkill}
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

export default NewSkill;