import PersonalPage from "../components/PersonalPage";
import { CONTENT } from "../lib/content";
import { META_PERSONAL } from "../lib/site";

export default function Personal({ toggleTheme }) {
  return (
    <PersonalPage
      content={CONTENT.en}
      meta={META_PERSONAL.en}
      toggleTheme={toggleTheme}
    />
  );
}
