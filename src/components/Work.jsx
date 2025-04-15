import React, { useEffect } from "react";
import styles from './Work.module.css';
import WorkCard from './WorkCard';

function Work() {

    const removeActiveClass = (element) => {
        element.classList.remove(styles.active);
    };

    const addActiveClass = (element) => {
        element.classList.add(styles.active);
    };

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["work1", "work2", "work3"].map(id => document.getElementById(id));
            sections.forEach(section => {
                removeActiveClass(section);
            });
        };

        const handleScrollEnd = () => { // Renamed for clarity, but still triggered on scroll
            const sections = ["work1", "work2", "work3"].map(id => document.getElementById(id));
            const activeIndex = Math.floor((window.scrollY + window.innerHeight / 2) / window.innerHeight);
            const activeSection = sections[activeIndex];

            if (!activeSection) return; // Early exit if no active section
            addActiveClass(activeSection);
        };

        window.addEventListener('scroll', handleScroll); // Correctly remove the active class
        window.addEventListener('scroll', handleScrollEnd); // Add the active class - this might be problematic

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('scroll', handleScrollEnd);
        };
    }, []);

    return (
        <div id="work">
            <section id="work1" className={`${styles.section} ${styles.work1}`} style={{ backgroundImage: 'url(https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}>
                <div className={styles.workCard}>
                    <WorkCard title="Super Mario 3d world" description="A plataform game for the Nintendo Switch" tags={['Nintendo', 'Switch', 'Platform']} />
                </div>
            </section>

            <section id="work2" className={`${styles.section} ${styles.work2}`} style={{ backgroundImage: 'url(https://images.pexels.com/photos/11035474/pexels-photo-11035474.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}>
                <div className={styles.workCard}>
          <WorkCard
              title="Design System"
            description="A design system made for the Web"
            tags={['Design', 'Web', 'Components']}
          />
        </div>
            </section>

            <section id="work3" className={`${styles.section} ${styles.work3}`} style={{ backgroundImage: 'url(https://images.pexels.com/photos/459653/pexels-photo-459653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}>
                <div className={styles.workCard}>
          <WorkCard
            title="Website"
            description="A Website made with Html, Css and Js"
            tags={['Website', 'Html', 'Css', 'Js']}
          />
        </div>
            </section>
        </div>
    );
}
export default Work;