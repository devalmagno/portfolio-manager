interface IProject {
    id: string;
    title: string;
    source: string;
    description: string;
    images: string[];
    skillsUsed: string[]
    platforms: string[]
    isFavorite: boolean;
}

export default IProject;