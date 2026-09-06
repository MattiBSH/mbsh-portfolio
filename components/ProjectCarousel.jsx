import React from "react";
import Slider from "react-slick";
import styles from "../styles/theme.module.css";

// The projects section always sits on the dark page background (global.css sets
// html to #232020 and .projectsDiv adds no background of its own), so these
// cards deliberately do not follow the light/dark toggle.
const ProjectCarousel = ({ projects }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    // react-slick breakpoints are max-width based.
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {projects &&
        projects.map((project) => (
          <div key={project.title}>
            <div className={styles.projectCard}>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>
            </div>
          </div>
        ))}
    </Slider>
  );
};

export default ProjectCarousel;
