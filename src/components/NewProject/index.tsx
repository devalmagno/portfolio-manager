import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import {
    IoSend,
    IoAttachSharp,
} from 'react-icons/io5';
import { MdOutlineFavoriteBorder, MdOutlineFavorite } from 'react-icons/md';

import { db, storage } from '../../lib/firebaseConfig';
import colors from '../../styles/colors.module.scss';

import IProject from '../../types/Project';

import styles from './project.module.scss';
import { useDataContext } from '../../contexts/DataContext';

interface Props {
    projects: IProject[];
    setProjects: Dispatch<SetStateAction<IProject[]>>;
}

const NewProject = ({ projects, setProjects }: Props) => {
    const { skills, categories } = useDataContext();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [platforms, setPlatforms] = useState<string[]>([]);
    const [skillsUsed, setSkillsUsed] = useState<string[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const imageElements = images.map(img => (
        <div className={styles.img}>
            <img
                key={img}
                src={img}
            />
        </div>
    ));

    const handlePlatformState = (platform: string) => {
        const isAdded = platforms.some(e => e === platform);
        if (!isAdded) setPlatforms([platform, ...platforms]);
        else {
            const platformList = platforms;
            const index = platforms.indexOf(platform);
            platformList.splice(index, 1);
            setPlatforms([...platformList]);
        }
    }

    const platformElements = categories.map(e => {
        let isSelected = false;
        if (platforms.some(platform => platform === e.name)) isSelected = true;

        return (
            <button
                onClick={() => handlePlatformState(e.name)}
                className={isSelected ? `${styles.btnText} ${styles.selected}` : styles.btnText}
            >
                {e.name}
            </button>
        );
    });

    const handleSkillsUsedState = (skill: string) => {
        const isAdded = skillsUsed.some(e => e === skill);
        if (!isAdded) setSkillsUsed([skill, ...skillsUsed]);
        else {
            const skillList = skillsUsed;
            const index = skillList.indexOf(skill);
            skillList.splice(index, 1);
            setPlatforms([...skillList]);
        }
    }

    const skillsUsedElements = skills.map(e => {
        let isSelected = false;
        if (skillsUsed.some(skill => skill === e.name)) isSelected = true;

        return (
            <button
                onClick={() => handleSkillsUsedState(e.name)}
                className={isSelected ? `${styles.btnText} ${styles.selected}` : styles.btnText}
            >
                {e.name}
            </button>
        );
    });

    const handleHiddenTextArea = () => {
        textAreaRef.current?.focus();
        setIsEditingDescription(true);
    }

    const handleHiddenInputFile = () => {
        if (title !== '')
            inputRef.current?.click();
    }

    const handleImageChange = (e: React.FormEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files)
            uploadImage(files[0] as File)
    }

    const uploadImage = async (file: File) => {
        const storageRef = ref(storage, `images/${title}${images.length}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setImages([...images, url]);
    }

    const createProject = async () => {
        if (title === '' ||
            description === '' ||
            source === '' ||
            images.length === 0 ||
            platforms.length === 0 ||
            skillsUsed.length === 0) return;

        try {
            const projectsRef = collection(db, "projects");
            const { id } = await addDoc(projectsRef, {
                title,
                description,
                images,
                source,
                isFavorite,
                platforms,
                skillsUsed,
            });

            const project: IProject = {
                description,
                id,
                images,
                isFavorite,
                platforms,
                skillsUsed,
                title,
                source
            };

            setProjects([project, ...projects]);
            setTitle('')
            setSource('');
            setDescription('');
            setImages([]);
            setIsFavorite(false);
            setPlatforms([]);
            setSkillsUsed([]);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.container}>
            <div
                className={styles.createProject}
            >
                <div
                    className={styles.inputField}
                >
                    <input
                        type="text"
                        placeholder='Título'
                        spellCheck='false'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button
                        className={styles.btnIcon}
                        onClick={() => setIsFavorite(prevState => !prevState)}
                    >
                        {isFavorite ? (
                            <MdOutlineFavorite fill={colors.enabled} size={16} />
                        ) : (
                            <MdOutlineFavoriteBorder fill={colors.enabled} size={16} />
                        )}
                    </button>
                </div>
                <div
                    className={styles.inputField}
                >
                    <input
                        type="text"
                        placeholder='Link para o projeto'
                        spellCheck='false'
                        value={source}
                        onChange={(e) => setSource(e.target.value)}
                    />
                </div>

                <div className={styles.description} onClick={handleHiddenTextArea}>
                    <span>{description !== '' ? description : isEditingDescription ? 'Por gentileza, digite a descrição...' : 'Criar nota...'}</span>
                    <textarea
                        ref={textAreaRef}
                        spellCheck='false'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className={styles.box}>
                    Available for:
                    {platformElements}
                </div>

                <div className={styles.box}>
                    Skills used:
                    {skillsUsedElements}
                </div>

                <div
                    className={styles.images}
                    style={images.length < 1 ? { display: "none" } : {}}
                >
                    {imageElements}
                </div>


                <div
                    className={styles.actions}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        style={{
                            opacity: 0,
                            position: 'absolute',
                            top: '-90px',
                        }}
                        onChange={handleImageChange}
                    />
                    <button
                        className={styles.btnIcon}
                        onClick={handleHiddenInputFile}
                    >
                        <IoAttachSharp fill='#51646E' size={18} />
                    </button>
                    <button
                        className={styles.btnIcon}
                        onClick={createProject}
                    >
                        <IoSend fill='#51646E' size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewProject;