import { useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { } from 'react-icons';

import { db } from '../../lib/firebaseConfig';

import styles from './skill.module.scss';
import { addDoc, collection } from 'firebase/firestore';
import ISkill from '../../types/Skill';
import { useDataContext } from '../../contexts/DataContext';

const NewSkill = () => {
    const { skills, setSkills } = useDataContext();
    const [name, setName] = useState('');

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
                
                <button
                    className={styles.btnIcon}
                    onClick={handleCreateSkill}
                >
                    <IoSend fill='#51646E' size={16} />
                </button>
 
            </div>
        </div>
    )
}

export default NewSkill;