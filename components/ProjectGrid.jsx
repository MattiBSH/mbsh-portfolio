import Image from "next/image";
import styles from "../styles/theme.module.css";
import { COMPANIES } from "../lib/content";

// Every project, all at once, in a responsive grid.
//
// This replaced a react-slick carousel. The carousel decided its layout in
// componentDidMount, so the prerendered HTML was always the desktop 3-up
// variant and a phone painted three 108px columns before hydration reflowed the
// page by ~770px: CLS 0.52 on a throttled Pixel 5, the only failing Core Web
// Vital on the site. It also showed 3 of 11 projects, marked the rest
// aria-hidden, cloned 14 extra slides into the DOM and cost 17 kB over the
// wire. A grid is the whole content, server-rendered and final at first paint.
//
// The cards follow the light/dark toggle like everything else, light-first with
// a dark override further down the stylesheet.
// `variant` is presentation only. "compact" is the secondary run below the
// featured three: denser columns, less padding, quieter type. The description
// still renders in full rather than being clipped — the point is to draw less
// attention, not to withhold what the project was.
const ProjectGrid = ({ projects, lang = "en", labels = {}, variant = "featured" }) => {
  if (!projects || projects.length === 0) return null;
  const compact = variant === "compact";

  return (
    <div
      className={`${styles.projectGrid} ${compact ? styles.projectGridCompact : ""}`}
    >
      {projects.map((project) => {
        // Fall back to English rather than rendering a blank card. The parity
        // test is what stops a missing translation going unnoticed.
        const copy = project[lang] || project.en;
        const company = COMPANIES[project.company] || { name: project.company };
        const period =
          project.to === project.from
            ? String(project.from)
            : `${project.from}-${project.to ?? labels.present ?? ""}`;

        return (
          // The data attributes sit on the card itself now. Under react-slick
          // they had to go on a wrapper, because it injected two divs of its own
          // between the slide and whatever the map returned.
          <article
            key={project.id}
            className={`${styles.projectCard} ${
              compact ? styles.projectCardCompact : ""
            }`}
            data-project-id={project.id}
            data-featured={compact ? "false" : "true"}
            data-current={company.current ? "true" : "false"}
          >
            {project.image && (
              // Optional. The box reserves its space with aspect-ratio before
              // the file loads, so adding pictures cannot bring back the layout
              // shift that the carousel was removed for. next/image handles the
              // AVIF negotiation and lazy-loads everything below the fold.
              <div className={styles.projectShot}>
                <Image
                  className={styles.projectShotImg}
                  src={project.image.src}
                  alt={copy.imageAlt || copy.title}
                  width={project.image.width}
                  height={project.image.height}
                  sizes={compact ? "(max-width: 900px) 100vw, 25vw" : "(max-width: 900px) 100vw, 33vw"}
                />
              </div>
            )}

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
              // A real list, so a screen reader announces it as one rather than
              // reading a run-on line of spans.
              <ul className={styles.projectTech} aria-label={labels.tech}>
                {project.tech.map((tech) => (
                  <li className={styles.projectTag} key={tech}>
                    {tech}
                  </li>
                ))}
              </ul>
            )}
          </article>
        );
      })}
    </div>
  );
};

export default ProjectGrid;
