import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '../../lib/firebaseConfig';

import IProject from '../../types/Project';

import NewProject from '../../components/NewProject';

import homeStyle from '../Home/home.module.scss';
import Project from '../../components/Project';

const Projects = () => {
    const [projects, setProjects] = useState<IProject[]>([]);

    const projectElements = projects.map((e, index) => (
        <Project
            key={e.id}
            project={e}
            projects={projects}
            setProjects={setProjects}
            index={index}
        />
    ));

    useEffect(() => {
        const getProjects = async () => {
            const projectRef = collection(db, "projects");
            const data = await getDocs(projectRef);
            const projectList = data.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            } as IProject));
            setProjects(projectList);
        }

        getProjects();
    }, []);
    return (
        <main>
            <section>
                <NewProject 
                    projects={projects} 
                    setProjects={setProjects}
                />
            </section>
            <section>
                <h2>Projects</h2>
                <div className={homeStyle.content}>

                    {projectElements}
                </div>
            </section>
        </main>
    )
}

export default Projects;