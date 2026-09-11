/** Canonical site URL. Override with NEXT_PUBLIC_SITE_URL for previews. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://waves-cn.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "waves-cn";

export const SITE_DESCRIPTION =
  "Waveform components for shadcn/ui, built on wavesurfer.js. Install with one command, own the code, style it with your tokens.";

export const GITHUB_URL = "https://github.com/Ziane-Badreddine/waves-cn";
