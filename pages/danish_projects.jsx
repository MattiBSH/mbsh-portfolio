import ProjectsPage from "../components/ProjectsPage";
import { CONTENT } from "../lib/content";
import { META_PROJECTS } from "../lib/site";

export default function DanishProjects({ toggleTheme }) {
  return (
    <ProjectsPage
      content={CONTENT.da}
      meta={META_PROJECTS.da}
      toggleTheme={toggleTheme}
    />
  );
}
