import { useDataContext } from "../../contexts/DataContext";

import NewCategory from "../../components/NewCategory";
import CategoryCard from "../../components/CategoryCard";

import homeStyle from '../Home/home.module.scss';

const Categories = () => {
    const { categories } = useDataContext();

    const categoryElements = categories.map((category, index) => (
        <CategoryCard
            key={category.id}
            index={index}
            category={category}
        />
    ));

    return (
        <main>
            <section>
                <NewCategory />                
            </section>
            <section>
                <h2>Categories</h2>
                
                <div 
                    className={homeStyle.content}
                    style={{
                        rowGap: '10px',
                    }}
                >
                    {categoryElements}
                </div>
            </section>
        </main>
    )
}

export default Categories;