const { test, expect } = require("@playwright/test");

const themeOf = (page) =>
  page.evaluate(() => document.documentElement.getAttribute("data-theme"));

const fontPx = (locator) =>
  locator.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

test.describe("page loads", () => {
  test("English page renders its headline and sections", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Matti Hansen Portfolio");
    await expect(page.locator("h1")).toContainText("Matti Hansen");
    await expect(page.getByRole("heading", { name: "Frontend" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Backend" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "DevOps" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Education" })).toBeVisible();
  });

  test("Danish page renders translated content", async ({ page }) => {
    await page.goto("/danish_index");
    await expect(page.getByRole("heading", { name: /Jeg er/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Uddannelse" })).toBeVisible();
  });

  test("each page declares the right document language", async ({ page }) => {
    await page.goto("/");
    expect(await page.getAttribute("html", "lang")).toBe("en");

    await page.goto("/danish_index");
    expect(await page.getAttribute("html", "lang")).toBe("da");

    // lang must also follow a client-side navigation, since <html> is outside
    // the React tree and is never re-rendered.
    await page.getByRole("link", { name: "Skift til engelsk" }).click();
    await expect(page).toHaveURL(/localhost:3100\/$/);
    await expect.poll(() => page.getAttribute("html", "lang")).toBe("en");
  });

  test("the email address is a working mailto link", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: "mattibenhansen@gmail.com" });
    await expect(link).toHaveAttribute("href", "mailto:mattibenhansen@gmail.com");
  });

  test("profile image loads and is not broken", async ({ page }) => {
    await page.goto("/");
    const img = page.getByAltText("Picture of the author");
    await expect(img).toBeVisible();
    expect(await img.evaluate((el) => el.naturalWidth)).toBeGreaterThan(0);
  });
});

test.describe("work experience", () => {
  const entries = (page) =>
    page.$$eval("[data-experience-id]", (els) =>
      els.map((el) => ({
        id: el.dataset.experienceId,
        heading: el.querySelector("h3").textContent.trim(),
        // The internship badge is a span inside this line; strip it so
        // `period` means the dates and nothing else.
        period: (() => {
          const clone = el.querySelectorAll("p")[0].cloneNode(true);
          clone.querySelectorAll("span").forEach((sp) => sp.remove());
          return clone.textContent.trim();
        })(),
        body: el.querySelectorAll("p")[1].textContent.trim(),
      }))
    );

  test("the section lists every role with a company and a period", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
    const jobs = await entries(page);
    expect(jobs.length).toBeGreaterThanOrEqual(2);
    for (const j of jobs) {
      expect(j.heading, j.id).not.toBe("");
      expect(j.body, j.id).not.toBe("");
      // "2023–now" or "2021–2022" — a bare year is not a period.
      // A single-year role renders as one year, a span as "from–to".
      expect(j.period, j.id).toMatch(/^\d{4}([–-].+)?$/);
    }
  });

  test("the current role is open-ended, earlier ones are closed", async ({ page }) => {
    await page.goto("/");
    const jobs = await entries(page);
    const current = jobs.find((j) => j.id === "dafolo-dev");
    expect(current.period).toContain("now");
    expect(current.heading).toContain("Dafolo");
    const past = jobs.find((j) => j.id === "meew-student");
    expect(past.period).not.toContain("now");
    expect(past.period).toMatch(/\d{4}[–-]\d{4}/);
  });

  test("internships are badged and the current role is not", async ({ page }) => {
    await page.goto("/");
    const badged = await page.$$eval("[data-experience-id]", (els) =>
      els
        .filter((el) => el.querySelector("span"))
        .map((el) => el.dataset.experienceId)
    );
    // Interning somewhere then being hired is the point of splitting these.
    expect(badged).toContain("meew-intern");
    expect(badged).toContain("meew-student");
    expect(badged).toContain("dafolo-intern");
    // The current, ordinary role carries no qualifier.
    expect(badged).not.toContain("dafolo-dev");
  });

  test("the internship badge is translated", async ({ page }) => {
    await page.goto("/");
    const en = await page
      .locator('[data-experience-id="meew-intern"] span')
      .textContent();
    await page.goto("/danish_index");
    const da = await page
      .locator('[data-experience-id="meew-intern"] span')
      .textContent();
    expect(en.trim()).toBe("Internship");
    expect(da.trim()).toBe("Praktik");
  });

  test("a placement that converted shows both stages", async ({ page }) => {
    await page.goto("/");
    const kinds = await page.$$eval("[data-experience-id]", (els) =>
      Object.fromEntries(
        els.map((el) => [
          el.dataset.experienceId,
          el.querySelector("span") ? el.querySelector("span").textContent.trim() : null,
        ])
      )
    );
    // meew ran internship -> student worker; Dafolo internship -> employee.
    expect(kinds["meew-intern"]).toBe("Internship");
    expect(kinds["meew-student"]).toBe("Student worker");
    expect(kinds["dafolo-dev"]).toBeNull();
  });

  test("experience comes before education on the page", async ({ page }) => {
    await page.goto("/");
    // A reader looks for work history first; it is also the more recent of the two.
    const order = await page.$$eval("h2", (els) =>
      els.map((e) => e.textContent.trim())
    );
    expect(order.indexOf("Experience")).toBeGreaterThan(-1);
    expect(order.indexOf("Experience")).toBeLessThan(order.indexOf("Education"));
  });

  test("experience is translated, and both languages list the same roles", async ({ page }) => {
    await page.goto("/");
    const en = await entries(page);
    await page.goto("/danish_index");
    await expect(page.getByRole("heading", { name: "Erfaring" })).toBeVisible();
    const da = await entries(page);

    expect(da.map((j) => j.id)).toEqual(en.map((j) => j.id));
    for (let i = 0; i < en.length; i++) {
      // Same facts, different prose — a missing translation would match.
      expect(da[i].body, en[i].id).not.toBe(en[i].body);
      if (en[i].period.includes("now")) {
        // Only the open-ended role has a translatable word in its period.
        expect(da[i].period, en[i].id).toContain("nu");
      } else {
        // A closed range is just years, identical in both languages.
        expect(da[i].period, en[i].id).toBe(en[i].period);
      }
    }
  });
});

test.describe("social preview metadata", () => {
  test("English page exposes description and Open Graph tags", async ({ page }) => {
    await page.goto("/");
    const content = (sel) => page.locator(sel).first().getAttribute("content");

    expect(await content('meta[name="description"]')).toContain("Software developer");
    expect(await content('meta[property="og:title"]')).toContain("Matti Hansen");
    expect(await content('meta[property="og:type"]')).toBe("website");
    expect(await content('meta[name="twitter:card"]')).toBe("summary_large_image");

    // OG images must be absolute AND on the deployed domain, or scrapers
    // render the preview without an image.
    const image = await content('meta[property="og:image"]');
    expect(image).toBe("https://mbsh-portfolio.vercel.app/images/og.jpg");
    expect(await content('meta[property="og:url"]')).toBe(
      "https://mbsh-portfolio.vercel.app"
    );
  });

  test("Danish page exposes Danish Open Graph copy", async ({ page }) => {
    await page.goto("/danish_index");
    const og = await page
      .locator('meta[property="og:description"]')
      .first()
      .getAttribute("content");
    expect(og).toContain("Softwareudvikler");
  });
});

test.describe("regressions from the audit", () => {
  test("dark theme: education timeline text is readable on its card", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();

    // The dark block recolours .timelineHeader white; if nothing darkens
    // .timelineContent the whole timeline is white-on-white.
    const { fg, bg } = await page.evaluate(() => {
      // h3, not h2: timeline entries nest under the Education heading.
      const h = document.querySelector("h3[class*='timelineHeader']");
      const card = h.closest("div[class*='timelineContent']");
      return {
        fg: getComputedStyle(h).color,
        bg: getComputedStyle(card).backgroundColor,
      };
    });
    expect(fg).not.toBe(bg);
    expect(bg).not.toBe("rgb(255, 255, 255)");
  });

  test("the back link is readable against the panel in both themes", async ({ page }) => {
    const lum = (rgb) => {
      const [r, g, b] = rgb.match(/\d+/g).map(Number).map((v) => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = async () => {
      const { fg, bg } = await page.evaluate(() => {
        const a = document.querySelector("a[class*='backLink']");
        const panel = a.closest("div[class*='mainContent']");
        return {
          fg: getComputedStyle(a).color,
          bg: getComputedStyle(panel).backgroundColor,
        };
      });
      const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      return (l1 + 0.05) / (l2 + 0.05);
    };

    await page.goto("/personal");
    expect(await ratio()).toBeGreaterThan(4.5); // WCAG AA
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    expect(await ratio()).toBeGreaterThan(4.5);
  });

  test("every interactive control meets the 24x24 touch-target minimum", async ({ page }) => {
    // WCAG 2.5.8, and what Lighthouse's "Touch targets do not have sufficient
    // size or spacing" audit reports. slick ships 20x20 arrows and 20x20 dots,
    // so this fails again the moment those overrides are dropped.
    for (const route of ["/", "/danish_index", "/personal", "/danish_personal"]) {
      await page.goto(route);
      const undersized = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll("a, button, [role=button]").forEach((el) => {
          const b = el.getBoundingClientRect();
          if (!b.width || !b.height) return;
          // Carousel clones duplicate every control; measure the originals.
          if (el.closest(".slick-cloned")) return;
          if (b.width < 24 || b.height < 24) {
            out.push(
              `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} ` +
                `${Math.round(b.width)}x${Math.round(b.height)}`
            );
          }
        });
        return [...new Set(out)];
      });
      expect(undersized, `${route} has undersized targets`).toEqual([]);
    }
  });

  test("no route downloads a web font", async ({ page }) => {
    // The site uses the system font stack. slick-carousel bundles an icon font
    // for its arrow and dot glyphs, which Lighthouse flags for a missing
    // font-display; the CSS points those pseudo-elements at the inherited
    // family instead, leaving that @font-face unused and unfetched.
    const fonts = [];
    page.on("request", (r) => {
      if (/\.(woff2?|ttf|eot|otf)(\?|$)/i.test(r.url())) fonts.push(r.url());
    });
    for (const route of ["/", "/danish_index", "/personal", "/danish_personal"]) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
    }
    expect(fonts).toEqual([]);
  });

  test("carousel arrows and dots survive without the icon font", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "arrows are desktop-sized here");
    await page.goto("/");
    // Drawn in CSS now, so assert the shapes rather than a glyph.
    const arrow = await page.locator(".slick-prev").boundingBox();
    expect(Math.round(arrow.width)).toBe(44);
    expect(Math.round(arrow.height)).toBe(44);

    const dot = await page.locator(".slick-dots li button").first().evaluate((el) => {
      const cs = getComputedStyle(el, "::before");
      return { w: cs.width, r: cs.borderRadius, bg: cs.backgroundColor };
    });
    expect(dot.w).toBe("10px");
    expect(dot.bg).toContain("255, 255, 255");
  });

  test("no em dashes in the rendered copy", async ({ page }) => {
    // They read as a tell for machine-written text. Hyphens and ordinary
    // sentence breaks instead; date ranges use a plain hyphen.
    for (const route of ["/", "/danish_index", "/personal", "/danish_personal"]) {
      await page.goto(route);
      const text = await page.evaluate(() => document.body.innerText);
      expect(text, route).not.toContain("—"); // em dash
      expect(text, route).not.toContain("–"); // en dash
    }
  });

  test("body text has readable line spacing", async ({ page }) => {
    await page.goto("/");
    // WCAG 1.4.12 asks for at least 1.5x. It is also what gives the inline
    // email and LinkedIn links room to be tappable.
    const ratio = await page.locator("p[class*='description']").first().evaluate((el) => {
      const cs = getComputedStyle(el);
      return parseFloat(cs.lineHeight) / parseFloat(cs.fontSize);
    });
    expect(ratio).toBeGreaterThanOrEqual(1.5);
  });

  test("every route declares a canonical and hreflang alternates", async ({ page }) => {
    for (const [route, lang, alt] of [
      ["/", "en", "/danish_index"],
      ["/danish_index", "da", "/"],
      ["/personal", "en", "/danish_personal"],
      ["/danish_personal", "da", "/personal"],
    ]) {
      await page.goto(route);
      const canonical = await page.getAttribute('link[rel="canonical"]', "href");
      expect(canonical, route).toContain("mbsh-portfolio.vercel.app");
      const other = await page.getAttribute(
        `link[rel="alternate"][hreflang="${lang === "en" ? "da" : "en"}"]`,
        "href"
      );
      expect(other, route).toContain(alt === "/" ? "vercel.app" : alt);
    }
  });

  test("Danish routes ship lang=da in the static HTML, not just after JS", async ({ page }) => {
    // Crawlers that do not run JavaScript only ever see the served attribute.
    for (const route of ["/danish_index", "/danish_personal"]) {
      const res = await page.request.get(route);
      const html = await res.text();
      const tag = html.match(/<html[^>]*>/)[0];
      expect(tag, route).toContain('lang="da"');
    }
  });

  test("the two front pages do not share a title", async ({ page }) => {
    await page.goto("/");
    const en = await page.title();
    await page.goto("/danish_index");
    expect(await page.title()).not.toBe(en);
  });

  test("each reel button has its own accessible name", async ({ page }) => {
    await page.goto("/personal");
    const names = await page.$$eval("[data-reel-id]", (els) =>
      els.map((e) => e.getAttribute("aria-label"))
    );
    expect(names.length).toBeGreaterThan(1);
    expect(new Set(names).size).toBe(names.length);
  });

  test("focusable controls keep a visible focus ring", async ({ page }) => {
    await page.goto("/");
    const outline = await page
      .getByRole("button", { name: "Toggle dark mode" })
      .evaluate((el) => {
        el.focus();
        const cs = getComputedStyle(el);
        return cs.outlineStyle + " " + cs.outlineWidth;
      });
    expect(outline).not.toContain("none");
  });
});

test.describe("toolbar icons", () => {
  test("theme control shows a sun in light and a moon in dark", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("button", { name: "Toggle dark mode" });
    const sun = button.locator("svg").first();
    const moon = button.locator("svg").nth(1);

    await expect(sun).toBeVisible();
    await expect(moon).toBeHidden();

    await button.click();
    await expect(sun).toBeHidden();
    await expect(moon).toBeVisible();
  });

  test("language control shows the flag of the target language", async ({ page }) => {
    await page.goto("/");
    const toDanish = page.getByRole("link", { name: "Switch to Danish" });
    await expect(toDanish.locator("svg")).toBeVisible();

    await toDanish.click();
    await expect(page).toHaveURL(/danish_index/);
    await expect(
      page.getByRole("link", { name: "Skift til engelsk" }).locator("svg")
    ).toBeVisible();
  });

  test("both controls are the same size and circular", async ({ page }) => {
    await page.goto("/");
    const theme = await page
      .getByRole("button", { name: "Toggle dark mode" })
      .boundingBox();
    const lang = await page
      .getByRole("link", { name: "Switch to Danish" })
      .boundingBox();

    expect(Math.abs(theme.width - lang.width)).toBeLessThan(1);
    expect(Math.abs(theme.height - lang.height)).toBeLessThan(1);
    // Circular means square bounds.
    expect(Math.abs(theme.width - theme.height)).toBeLessThan(1);
  });
});

test.describe("theme toggle", () => {
  test("toggling switches the document theme and repaints the page", async ({ page }) => {
    await page.goto("/");
    expect(await themeOf(page)).toBe("light");

    const panel = page.locator("main > div").first();
    const lightBg = await panel.evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    expect(await themeOf(page)).toBe("dark");

    const darkBg = await panel.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(darkBg).not.toBe(lightBg);
  });

  test("theme survives navigation to the other language", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    expect(await themeOf(page)).toBe("dark");

    await page.getByRole("link", { name: "Switch to Danish" }).click();
    await expect(page).toHaveURL(/danish_index/);
    expect(await themeOf(page)).toBe("dark");

    await page.getByRole("link", { name: "Skift til engelsk" }).click();
    await expect(page).toHaveURL(/localhost:3100\/$/);
    expect(await themeOf(page)).toBe("dark");
  });

  test("theme survives a full reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.reload();
    expect(await themeOf(page)).toBe("dark");
  });

  test("dark theme is applied before first paint, with no light flash", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();

    // Record the theme as early as a script can observe the document. If React
    // were applying the theme instead of the inline head script, this would
    // read "light" here and only flip afterwards.
    const seen = [];
    await page.exposeFunction("recordTheme", (t) => seen.push(t));
    await page.addInitScript(() => {
      document.addEventListener("readystatechange", () => {
        if (document.readyState === "interactive") {
          window.recordTheme(document.documentElement.getAttribute("data-theme"));
        }
      });
    });

    await page.reload();
    expect(seen).toContain("dark");
  });
});

test.describe("random effect", () => {
  test("has no visible button in the toolbar", async ({ page }) => {
    await page.goto("/");
    // It is an easter egg now: triggered by the footer name, not a button.
    await expect(
      page.getByRole("button", { name: "Random effect" })
    ).toHaveCount(0);
  });

  test("is triggered by clicking the name in the footer", async ({ page }) => {
    await page.goto("/");
    const headline = page.locator("h1");
    const footerName = page.getByRole("button", { name: "Made by Matti Hansen" });
    await expect(footerName).toBeVisible();

    const before = await headline.evaluate((el) => getComputedStyle(el).color);
    await footerName.click();

    await expect
      .poll(() => headline.evaluate((el) => el.style.color), { timeout: 5000 })
      .not.toBe("");

    // The regression this guards: inline colours beat the stylesheet, so the
    // toggle must clear them or it silently stops changing text colour.
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    expect(await headline.evaluate((el) => el.style.color)).toBe("");

    const after = await headline.evaluate((el) => getComputedStyle(el).color);
    expect(after).not.toBe(before);
  });
});

test.describe("personal page", () => {
  test("shows the nature-video section and links to the channel", async ({ page }) => {
    await page.goto("/personal");
    await expect(page.getByRole("heading", { name: "Outside work" })).toBeVisible();
    await expect(page.getByText("I film Danish nature")).toBeVisible();

    const link = page.getByRole("link", { name: /Watch on YouTube/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      "https://www.youtube.com/@TheRealDanishNature"
    );
    // External link, so it should open in a new tab without leaking the referrer.
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  });

  test("the section is translated on the Danish page", async ({ page }) => {
    await page.goto("/danish_personal");
    await expect(
      page.getByRole("heading", { name: "Uden for arbejdet" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Se med på YouTube/ })
    ).toHaveAttribute("href", "https://www.youtube.com/@TheRealDanishNature");
  });
});

test.describe("personal page routing", () => {
  test("the front page no longer carries the personal section", async ({ page }) => {
    await page.goto("/");
    // The whole point of the move: nothing nature-related on the portfolio page.
    await expect(page.getByRole("heading", { name: "Outside work" })).toHaveCount(0);
    await expect(page.locator("[data-reel-id]")).toHaveCount(0);
  });

  test("the teaser under Projects leads to the personal page", async ({ page }) => {
    await page.goto("/");
    const teaser = page.getByRole("link", { name: /film Danish nature/ });
    await expect(teaser).toBeVisible();
    await teaser.click();
    await expect(page).toHaveURL(/\/personal$/);
    await expect(page.getByRole("heading", { name: "Outside work" })).toBeVisible();
  });

  test("the back link returns to the portfolio", async ({ page }) => {
    await page.goto("/personal");
    await page.getByRole("link", { name: /Back to the portfolio/ }).click();
    await expect(page).toHaveURL(/localhost:3100\/$/);
    await expect(page.locator("h1")).toContainText("Matti Hansen");
  });

  test("the language switch stays on the personal page", async ({ page }) => {
    await page.goto("/personal");
    await page.getByRole("link", { name: "Switch to Danish" }).click();
    await expect(page).toHaveURL(/\/danish_personal$/);
    await expect(page.getByRole("heading", { name: "Uden for arbejdet" })).toBeVisible();

    await page.getByRole("link", { name: "Skift til engelsk" }).click();
    await expect(page).toHaveURL(/\/personal$/);
  });

  test("each personal route declares the right document language", async ({ page }) => {
    await page.goto("/personal");
    expect(await page.getAttribute("html", "lang")).toBe("en");

    await page.goto("/danish_personal");
    expect(await page.getAttribute("html", "lang")).toBe("da");
  });

  test("the personal page has its own social preview copy", async ({ page }) => {
    await page.goto("/personal");
    const content = (sel) => page.locator(sel).first().getAttribute("content");
    // Must differ from the portfolio's, or both share one link preview.
    expect(await content('meta[name="description"]')).toContain("Nature clips");
    expect(await content('meta[property="og:url"]')).toContain("/personal");
  });

  test("the theme survives moving between the two pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Toggle dark mode" }).click();
    await page.getByRole("link", { name: /film Danish nature/ }).click();
    await expect(page).toHaveURL(/\/personal$/);
    expect(
      await page.evaluate(() => document.documentElement.getAttribute("data-theme"))
    ).toBe("dark");
  });
});

test.describe("reels", () => {
  test("any reel thumbnails reference well-formed YouTube ids", async ({ page }) => {
    await page.goto("/personal");
    const reels = page.locator("[data-reel-id]");
    const count = await reels.count();

    for (let i = 0; i < count; i++) {
      const id = await reels.nth(i).getAttribute("data-reel-id");
      expect(id).toMatch(/^[A-Za-z0-9_-]{11}$/);
      // Thumbnails are loading="lazy" and sit below the fold, so scroll them
      // into view before asserting they decoded. A black card here means a
      // bad video id.
      const img = reels.nth(i).locator("img");
      await img.scrollIntoViewIfNeeded();
      await expect
        .poll(() => img.evaluate((el) => el.naturalWidth), { timeout: 15000 })
        .toBeGreaterThan(0);
    }
  });
});

test.describe("reel lightbox", () => {
  const openFirst = async (page) => {
    await page.goto("/personal");
    const first = page.locator("[data-reel-id]").first();
    await first.scrollIntoViewIfNeeded();
    await first.click();
    return page.locator("[data-lightbox]");
  };

  test("clicking a reel opens a focused player", async ({ page }) => {
    const box = await openFirst(page);
    await expect(box).toBeVisible();
    await expect(box).toHaveAttribute("aria-modal", "true");

    // The player is only created once the lightbox opens.
    const frame = box.locator("iframe");
    await expect(frame).toBeVisible();
    expect(await frame.getAttribute("src")).toContain("youtube-nocookie.com/embed/");
  });

  test("the page behind is locked from scrolling while open", async ({ page }) => {
    const box = await openFirst(page);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(box).toHaveCount(0);
    // Scrolling must be restored, not left locked.
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  });

  test("closes on Escape, the close button, and the backdrop", async ({ page }) => {
    let box = await openFirst(page);
    await page.keyboard.press("Escape");
    await expect(box).toHaveCount(0);

    box = await openFirst(page);
    await page.getByRole("button", { name: "Close" }).click();
    await expect(box).toHaveCount(0);

    box = await openFirst(page);
    // Click the backdrop itself, not the player.
    await box.click({ position: { x: 5, y: 5 } });
    await expect(box).toHaveCount(0);
  });

  test("clicking the player does not close it", async ({ page }) => {
    const box = await openFirst(page);
    await box.locator("iframe").click({ force: true });
    await expect(box).toBeVisible();
  });

  test("arrow keys move between reels and wrap around", async ({ page }) => {
    const box = await openFirst(page);
    const srcOf = () => box.locator("iframe").getAttribute("src");

    const first = await srcOf();
    await page.keyboard.press("ArrowRight");
    await expect.poll(srcOf).not.toBe(first);

    await page.keyboard.press("ArrowLeft");
    await expect.poll(srcOf).toBe(first);

    // Stepping back from the first reel wraps to the last.
    await page.keyboard.press("ArrowLeft");
    await expect.poll(srcOf).not.toBe(first);
  });

  test("Tab stays inside the lightbox", async ({ page }) => {
    const box = await openFirst(page);
    await expect(box).toBeVisible();
    for (let i = 0; i < 8; i++) await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const dlg = document.querySelector("[data-lightbox]");
      return dlg ? dlg.contains(document.activeElement) : false;
    });
    expect(inside).toBe(true);
  });

  test("focus returns to the thumbnail after closing", async ({ page }) => {
    await openFirst(page);
    await page.keyboard.press("Escape");
    const focusedId = await page.evaluate(
      () => document.activeElement?.getAttribute("data-reel-id")
    );
    expect(focusedId).toBeTruthy();
  });
});

test.describe("links", () => {
  test("the LinkedIn link is clickable and points at the profile", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /LinkedIn/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/matti-hansen-74a454109/"
    );
  });
});

test.describe("layout", () => {
  test("the headline divider is visible and has height", async ({ page }) => {
    await page.goto("/");
    // Regression guard for the `class=` typo, which left this element unstyled.
    const line = page.locator("h1 + div").first();
    const box = await line.boundingBox();
    expect(box.height).toBeGreaterThan(0);
    expect(box.width).toBeGreaterThan(50);
  });

  const ROUTES = ["/", "/danish_index", "/personal", "/danish_personal"];

  test("no route scrolls horizontally", async ({ page }) => {
    for (const route of ROUTES) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow, route).toBeLessThanOrEqual(1);
    }
  });

  test("no route scrolls horizontally at 320px", async ({ page }) => {
    // The narrowest phone still in use. slick's arrows sit 25px outside
    // .projectsDiv, which is what broke this before.
    await page.setViewportSize({ width: 320, height: 800 });
    for (const route of ROUTES) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth
      );
      expect(overflow, route + " @320").toBeLessThanOrEqual(1);
    }
  });

  test("timeline cards keep clear of the centre line on desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "single column on mobile");
    await page.goto("/");
    const gaps = await page.evaluate(() => {
      const line = document.querySelector(
        "div[class*='timeline']:not([class*='Item']):not([class*='Content'])"
      );
      const r0 = line.getBoundingClientRect();
      const lx = r0.left + r0.width / 2;
      return [...document.querySelectorAll("div[class*='timelineContent']")].map(
        (c) => {
          const r = c.getBoundingClientRect();
          return Math.min(Math.abs(lx - r.right), Math.abs(r.left - lx));
        }
      );
    });
    expect(gaps.length).toBeGreaterThan(0);
    for (const g of gaps) expect(g).toBeGreaterThan(8);
  });

  test("body text stays readable on every route", async ({ page }) => {
    for (const route of ["/danish_index", "/personal", "/danish_personal"]) {
      await page.goto(route);
      const p = page.locator("p").first();
      expect(await fontPx(p), route).toBeGreaterThanOrEqual(12);
    }
    await page.goto("/");
    // The old `vw` sizes rendered body copy at roughly 3px on a phone.
    const body = page.locator("p").first();
    expect(await fontPx(body)).toBeGreaterThanOrEqual(12);

    const headline = page.locator("h1");
    const size = await fontPx(headline);
    expect(size).toBeGreaterThanOrEqual(24);
    expect(size).toBeLessThanOrEqual(60);
  });
});

// react-slick clones slides when infinite is on, and marks inactive ones
// aria-hidden — which Playwright's role engine skips. So project assertions go
// through data attributes and textContent, never getByRole.
//
// Note the descendant combinator: react-slick does NOT merge props onto
// .slick-slide, it wraps the element you return in two divs, so data-project-id
// ends up a grandchild rather than on the slide itself.
const SLIDE = ".slick-slide:not(.slick-cloned) [data-project-id]";

const projectIds = (page) =>
  page.$$eval(SLIDE, (els) => els.map((el) => el.dataset.projectId));

const projectCopy = (page) =>
  page.$$eval(SLIDE, (els) =>
    Object.fromEntries(
      els.map((el) => [
        el.dataset.projectId,
        {
          title: el.querySelector("h3").textContent.trim(),
          description: el.querySelector("p").textContent.trim(),
          tech: [...el.querySelectorAll("li")].map((li) =>
            li.textContent.trim()
          ),
        },
      ])
    )
  );

test.describe("projects carousel", () => {
  test("shows project cards", async ({ page }) => {
    await page.goto("/");
    const copy = await projectCopy(page);
    expect(copy["ai-gdpr"].title).toContain("AI GDPR");
  });

  test("every card has a title, a description and tech tags", async ({ page }) => {
    await page.goto("/");
    const copy = await projectCopy(page);
    const ids = Object.keys(copy);
    expect(ids.length).toBeGreaterThanOrEqual(6);

    for (const id of ids) {
      expect(copy[id].title, id).not.toBe("");
      expect(copy[id].description, id).not.toBe("");
      expect(copy[id].tech.length, id).toBeGreaterThan(0);
    }
  });

  test("project ids are unique", async ({ page }) => {
    await page.goto("/");
    const ids = await projectIds(page);
    // Duplicates would collide as React keys. Titles can repeat; ids must not.
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("the current employer is badged differently from earlier roles", async ({ page }) => {
    await page.goto("/");
    const badgeBg = (sel) =>
      page
        .locator(sel)
        .first()
        .locator("span")
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor);

    expect(await badgeBg('[data-current="true"]')).not.toBe(
      await badgeBg('[data-current="false"]')
    );
  });

  test("project copy is translated on the Danish page", async ({ page }) => {
    await page.goto("/danish_index");
    const copy = await projectCopy(page);
    expect(copy["nemsoeg"].title).toBe("Nemsøg");
    expect(copy["nemsoeg"].description).toContain("matrikler");
  });

  test("both languages show the same projects, none fell back to English", async ({ page }) => {
    await page.goto("/");
    const en = await projectCopy(page);
    await page.goto("/danish_index");
    const da = await projectCopy(page);

    // One array feeds both pages, so a difference here means the component
    // dropped something rather than the data being out of step.
    expect(Object.keys(da)).toEqual(Object.keys(en));

    for (const id of Object.keys(en)) {
      // Titles may legitimately match; descriptions must not. An entry added
      // with only an `en` block renders English on the Danish page, and this
      // is what catches it.
      expect(da[id].description, `${id} has no Danish description`).not.toBe(
        en[id].description
      );
      // Tech is language-neutral by construction — assert it, so a refactor
      // that duplicates it per language is caught immediately.
      expect(da[id].tech, id).toEqual(en[id].tech);
    }
  });

  test("the dot row does not grow one dot per project", async ({ page }, testInfo) => {
    await page.goto("/");
    const dots = await page.locator(".slick-dots li").count();
    const projects = (await projectIds(page)).length;
    const perPage = testInfo.project.name === "mobile" ? 1 : 3;
    expect(dots).toBe(Math.ceil(projects / perPage));
  });

  test("a hovered card is not clipped by the carousel viewport", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "no hover on touch");
    await page.goto("/");
    const card = page.locator(".slick-slide.slick-active article").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await page.waitForTimeout(400);

    // .projectCard lifts on hover and .slick-list clips overflow; if the list
    // has no vertical padding the top of the card is cut off.
    const { cardTop, listTop } = await page.evaluate(() => {
      const a = document.querySelector(".slick-slide.slick-active article");
      const l = document.querySelector(".slick-list");
      return {
        cardTop: a.getBoundingClientRect().top,
        listTop: l.getBoundingClientRect().top,
      };
    });
    expect(cardTop).toBeGreaterThanOrEqual(listTop);
  });

  test("adapts the number of visible slides to the viewport", async ({ page }, testInfo) => {
    await page.goto("/");
    const list = page.locator(".slick-list");
    await expect(list).toBeVisible();

    const ratio = await page.evaluate(() => {
      const listEl = document.querySelector(".slick-list");
      const slide = document.querySelector(".slick-slide");
      return slide.getBoundingClientRect().width / listEl.getBoundingClientRect().width;
    });

    // One card fills the carousel on a phone; three share it on desktop.
    const expected = testInfo.project.name === "mobile" ? 1 : 1 / 3;
    expect(Math.abs(ratio - expected)).toBeLessThan(0.08);
  });
});
