import React from "react";
import Slider from "react-slick";
import styles from "../styles/theme.module.css";
import { COMPANIES } from "../lib/content";

// The projects section always sits on the dark page background (global.css sets
// html to #232020 and .projectsDiv adds no background of its own), so these
// cards deliberately do not follow the light/dark toggle.
const ProjectCarousel = ({ projects, lang = "en", labels = {} }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    // Must match slidesToShow. react-slick renders ceil(slideCount /
    // slidesToScroll) dots, so leaving this at 1 gives one dot per project and
    // the row grows without limit as projects are added.
    slidesToScroll: 3,
    swipeToSlide: true,
    // react-slick breakpoints are max-width based, and each entry is merged
    // over the settings above — slidesToScroll has to be repeated or a phone
    // showing one card would still jump three at a time.
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {projects &&
        projects.map((project) => {
          // Fall back to English rather than rendering a blank card. The parity
          // test is what stops a missing translation going unnoticed.
          const copy = project[lang] || project.en;
          const company = COMPANIES[project.company] || {
            name: project.company,
          };
          const period =
            project.to === project.from
              ? String(project.from)
              : `${project.from}–${project.to ?? labels.present ?? ""}`;

          return (
            // react-slick wraps this in two divs of its own rather than merging
            // into .slick-slide, so the data attributes land on a grandchild —
            // selectors and tests use a descendant combinator. It must stay a
            // single plain element; a Fragment breaks the slide wiring.
            <div
              key={project.id}
              data-project-id={project.id}
              data-current={company.current ? "true" : "false"}
            >
              <article className={styles.projectCard}>
                <div className={styles.projectMeta}>
                  <span
                    className={`${styles.projectCompany} ${
                      company.current ? styles.projectCompanyCurrent : ""
                    }`}
                  >
                    {company.name}
                  </span>
                  <span className={styles.projectPeriod}>{period}</span>
                </div>

                <h3 className={styles.projectTitle}>{copy.title}</h3>
                <p className={styles.projectDescription}>{copy.description}</p>

                {project.tech && project.tech.length > 0 && (
                  // A real list, so a screen reader announces it as one rather
                  // than reading a run-on line of spans.
                  <ul className={styles.projectTech} aria-label={labels.tech}>
                    {project.tech.map((tech) => (
                      <li className={styles.projectTag} key={tech}>
                        {tech}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          );
        })}
    </Slider>
  );
};

export default ProjectCarousel;
