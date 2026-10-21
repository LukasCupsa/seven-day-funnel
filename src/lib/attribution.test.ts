import { describe, expect, it } from "vitest";
import { buildUrlWithParams, mergeAttribution, parseUrlAttribution } from "./attribution";
import { parseBookingIdentity, stripBookingIdentity, GHL_FORM_URL } from "./ghl";

describe("attribution reaches the GHL form URL", () => {
  it("keeps all five UTMs and fbclid from the page URL", () => {
    const a = parseUrlAttribution(
      "?utm_source=fb&utm_medium=paid&utm_campaign=paint&utm_content=v1&utm_term=ottawa&fbclid=ABC&other=x",
    );
    expect(a).toEqual({
      utm_source: "fb",
      utm_medium: "paid",
      utm_campaign: "paint",
      utm_content: "v1",
      utm_term: "ottawa",
      fbclid: "ABC",
    });
  });

  it("appends attribution, niche and page_slug to the form src", () => {
    const src = new URL(
      buildUrlWithParams(
        GHL_FORM_URL,
        { utm_source: "fb", fbclid: "ABC", fbp: "fb.1.1.2" },
        { niche: "painting", page_slug: "painting-contractors" },
      ),
    );
    expect(src.searchParams.get("utm_source")).toBe("fb");
    expect(src.searchParams.get("fbclid")).toBe("ABC");
    expect(src.searchParams.get("fbp")).toBe("fb.1.1.2");
    expect(src.searchParams.get("niche")).toBe("painting");
    expect(src.searchParams.get("page_slug")).toBe("painting-contractors");
  });

  it("does not wipe stored values when a later page has no UTMs", () => {
    expect(mergeAttribution({ utm_source: "fb" }, {})).toEqual({ utm_source: "fb" });
  });
});

describe("booking page identity params", () => {
  it("reads name/email/phone and strips them from the address bar", () => {
    const search = "?first_name=Jo&email=jo%40x.com&utm_source=fb";
    expect(parseBookingIdentity(search)).toEqual({ first_name: "Jo", email: "jo@x.com" });
    expect(stripBookingIdentity(search)).toBe("?utm_source=fb");
  });
});
