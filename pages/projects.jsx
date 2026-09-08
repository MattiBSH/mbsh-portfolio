import ProjectsPage from "../components/ProjectsPage";
import { CONTENT } from "../lib/content";
import { META_PROJECTS } from "../lib/site";

export default function Projects({ toggleTheme }) {
  return (
    <ProjectsPage
      content={CONTENT.en}
      meta={META_PROJECTS.en}
      toggleTheme={toggleTheme}
    />
  );
}
