import { useDataContext } from "../../contexts/DataContext";

import NewSkill from "../../components/NewSkill";
import SkillCard from "../../components/SkillCard";

import homeStyle from '../Home/home.module.scss';

const Skills = () => {
    const { skills, setSkills } = useDataContext();

    const skillElements = skills.map((skill, index) => (
        <SkillCard
            key={skill.id}
            index={index}
            skill={skill}
        />
    ));

    return (
        <main>
            <section>
                <NewSkill />                
            </section>
            <section>
                <h2>Skills</h2>
                
                <div 
                    className={homeStyle.content}
                    style={{
                        rowGap: '10px',
                    }}
                >
                    {skillElements}
                </div>
            </section>
        </main>
    )
}

export default Skills;