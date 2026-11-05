# Homepage performance review

On 5 November 2026, three Lighthouse 13.6 mobile lab navigations were recorded before and three after the responsive-image change, using headless Chrome, a 412 × 823 viewport, device scale factor 1.75 and Lighthouse's simulated throttling. These are measurements from one workstation, not real-user or CrUX data. The before and after sets were separated in time and lab conditions can vary.

| Measurement | Before: median (range) | After: median (range) |
| --- | --- | --- |
| Performance score | 88 (86–89) | 85 (85–86) |
| Largest Contentful Paint | 1.47 s (1.33–2.24 s) | 1.45 s (1.33–1.69 s) |
| Total Blocking Time | 481 ms (428–494 ms) | 588 ms (558–592 ms) |
| Accessibility / best practices / SEO | 100 / 100 / 63 in each run | 100 / 100 / 63 in each run |

In the sampled runs, optimized product and hero image requests transferred approximately 168 KB before and 71 KB after. The revised card `sizes` attribute selects smaller images, and the hero is eagerly loaded with high fetch priority. Lighthouse's image-delivery audit no longer reported the previous estimated 85 KiB saving. The small change in median LCP is not enough to establish a speed improvement; blocking time and the overall score were worse in the later runs. Investigate main-thread work with a comparable trace and real-user data before drawing conclusions or claiming improved Core Web Vitals.

The same Lighthouse reports attribute approximately 1.16–1.21 seconds of main-thread work in the later runs to script evaluation and 0.78–0.91 seconds to style and layout. A generated Next.js/React bundle was the largest script-evaluation item in one run; the exact bundle attribution varied across runs. These synthetic audit breakdowns do not isolate a specific application component as the cause. An unauthenticated PageSpeed Insights request returned HTTP 429, so it supplied no field data. Do not remove client navigation or attribution based solely on these lab observations; compare browser traces and real-user measurements before making that tradeoff.

SEO remains 63 because the site intentionally sends `noindex` while content and launch approval are pending. Do not enable indexing until the company approves launch. Real-device, screen-reader and field-performance checks remain open.
