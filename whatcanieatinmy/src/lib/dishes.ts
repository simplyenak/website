import { fetchCollection } from '~/lib/payload-client';

/** Fetch dishes with dietary info (from Payload collection) */
export async function fetchDishes() {
  const dishes = await fetchCollection('dishes');
  if (!dishes) {
    throw new Error('[fetchDishes] Failed to load dishes from Payload CMS');
  }
  return dishes;
}