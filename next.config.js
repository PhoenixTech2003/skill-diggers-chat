import createMDX from '@next/mdx'
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    pageExtensions:["js","jsx","ts","tsx","md","mdx"],
     // Enable Partial Pre-Rendering (PPR) in Next.js 16
};
const withMDX = createMDX({
    // Add markdown plugins here, as desired
  })
export default withMDX(config);
