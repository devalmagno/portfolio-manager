import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";

import {
    BiSolidEdit,
    BiTrash,
} from 'react-icons/bi';
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
    project: IProject;
    projects: IProject[];
    setProjects: Dispatch<SetStateAction<IProject[]>>;
    index: number;
}

const Project = ({ projects, setProjects, project, index }: Props) => {
    const { categories, skills } = useDataContext();

    const [title, setTitle] = useState(project.title);
    const [description, setDescription] = useState(project.description);
    const [source, setSource] = useState(project.source);
    const [images, setImages] = useState<string[]>(project.images);
    const [platforms, setPlatforms] = useState<string[]>(project.platforms);
    const [skillsUsed, setSkillsUsed] = useState<string[]>(project.skillsUsed);
    const [isFavorite, setIsFavorite] = useState(project.isFavorite);

    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const [isEditable, setIsEditable] = useState(false);

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
                onClick={() => { isEditable && handlePlatformState(e.name) }}
                className={isSelected ? `${styles.btnText} ${styles.selected}` : styles.btnText}
                style={isEditable ? {} : isSelected ? {} : { display: 'none' }}
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
                onClick={() => { isEditable && handleSkillsUsedState(e.name) }}
                className={isSelected ? `${styles.btnText} ${styles.selected}` : styles.btnText}
                style={isEditable ? {} : isSelected ? {} : { display: 'none' }}
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

    const updateProject = async () => {
        if (title === project.title &&
            description === project.description &&
            source === project.source &&
            images === project.images &&
            platforms === project.platforms &&
            skillsUsed === project.skillsUsed) return;

        try {
            const projectRef = doc(db, "projects", project.id);
            await updateDoc(projectRef, {
                title,
                description,
                images,
                source,
                isFavorite,
                platforms,
                skillsUsed,
            });

            const updatedProject: IProject = {
                ...project,
                description,
                images,
                isFavorite,
                platforms,
                skillsUsed,
                title,
                source
            };

            const projectList = [...projects];
            projectList.splice(index, 1);

            setProjects([updatedProject, ...projectList]);
            setIsEditable(false);
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
                        readOnly={!isEditable}
                    />
                    <button
                        className={styles.btnIcon}
                        onClick={() => { isEditable && setIsFavorite(prevState => !prevState) }}
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
                        readOnly={!isEditable}
                    />
                </div>

                <div className={styles.description} onClick={handleHiddenTextArea}>
                    <span>{description !== '' ? description : isEditingDescription ? 'Por gentileza, digite a descrição...' : 'Criar nota...'}</span>
                    <textarea
                        ref={textAreaRef}
                        spellCheck='false'
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        readOnly={!isEditable}
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
                    {isEditable ? (
                        <>
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
                                onClick={updateProject}
                            >
                                <IoSend fill='#51646E' size={16} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className={styles.btnIcon}
                            >
                                <BiTrash fill='#51646E' size={18} />
                            </button>
                            <button
                                className={styles.btnIcon}
                                onClick={() => setIsEditable(true)}
                            >
                                <BiSolidEdit fill='#51646E' size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Project;