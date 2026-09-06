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
    expect(image).toBe("https://mbsh-portfolio.vercel.app/images/profile.png");
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

test.describe("personal section", () => {
  test("shows the nature-video section and links to the channel", async ({ page }) => {
    await page.goto("/");
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
    await page.goto("/danish_index");
    await expect(
      page.getByRole("heading", { name: "Uden for arbejdet" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Se med på YouTube/ })
    ).toHaveAttribute("href", "https://www.youtube.com/@TheRealDanishNature");
  });
});

test.describe("reels", () => {
  test("any reel thumbnails reference well-formed YouTube ids", async ({ page }) => {
    await page.goto("/");
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
    await page.goto("/");
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

  test("the page never scrolls horizontally", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test("body text stays readable at this viewport", async ({ page }) => {
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

test.describe("projects carousel", () => {
  test("shows project cards", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "AI GDPR Integration" }).first()
    ).toBeVisible();
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
