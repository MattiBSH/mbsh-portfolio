import PersonalPage from "../components/PersonalPage";
import { CONTENT } from "../lib/content";
import { META_PERSONAL } from "../lib/site";

export default function DanishPersonal({ toggleTheme }) {
  return (
    <PersonalPage
      content={CONTENT.da}
      meta={META_PERSONAL.da}
      toggleTheme={toggleTheme}
    />
  );
}
