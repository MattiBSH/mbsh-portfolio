import Portfolio from "../components/Portfolio";
import { CONTENT } from "../lib/content";
import { META } from "../lib/site";

export default function Home({ toggleTheme }) {
  return (
    <Portfolio content={CONTENT.da} meta={META.da} toggleTheme={toggleTheme} />
  );
}
