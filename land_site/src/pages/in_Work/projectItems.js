export const TIER_ORDER = ['flagship', 'product', 'craft'];

/**
 * Sorts projects by portfolio tier (flagship → product → craft), stable inside a tier.
 *
 * Input:
 * - `list` (object[]): projects with a `tier`.
 *
 * Output:
 * - New sorted array; the input is not changed.
 */
export const sortByTier = (list) =>
  [...list].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier));

/**
 * Maps projects to `HoverPreviewList` items.
 *
 * Input:
 * - `list` (object[]): projects from `projectsData`.
 * - `t` (function): i18n translate function.
 *
 * Output:
 * - `{ id, href, title, meta, image }[]`.
 */
export const toPreviewItems = (list, t) =>
  list.map((project) => ({
    id: project.id,
    href: `/works/${project.id}`,
    title: t(project.titleKey),
    meta: t(`works.tier.${project.tier}`),
    image: project.thumbnail,
  }));
