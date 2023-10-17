import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs } from '@firebase/firestore';

import { db } from '../lib/firebaseConfig';

import ISkill from '../types/Skill';
import ICategory from '../types/Category';

interface ContextType {
    skills: ISkill[];
    setSkills: Dispatch<SetStateAction<ISkill[]>>;
    categories: ICategory[];
    setCategories: Dispatch<SetStateAction<ICategory[]>>;
}

type Props = {
    children: ReactNode;
}

const DataContext = createContext<ContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => {
    const dataContext = useContext(DataContext);

    if (!dataContext)
        throw new Error(
            "AuthContext has to be used within <AuthContext.Provider>"
        );

    return dataContext;
}

const DataProvider = (props: Props) => {
    const [skills, setSkills] = useState<ISkill[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);

    useEffect(() => {
        const getSkills = async () => {
            try {
                const skillsRef = collection(db, "skills");
                const data = await getDocs(skillsRef);
                const skillList = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as ISkill));
                setSkills(skillList);
            } catch (error) {
                console.log(error);
            }
        }

        const getCategories = async () => {
            try {
                const categoriesRef = collection(db, "categories");
                const data = await getDocs(categoriesRef);
                const categoryList = data.docs.map(doc => ({ ...doc.data(), id: doc.id } as ICategory));
                setCategories(categoryList);
            } catch (error) {
                console.log(error);
            }
        }

        getSkills();
        getCategories();
    }, []);

    return (
        <DataContext.Provider value={{
            setSkills,
            skills,
            categories,
            setCategories
        }}>
            {props.children}
        </DataContext.Provider>
    );
};

export default DataProvider;