import data from '~/data/events.json'

export const useEvents = () => {
  const categories = data.categories
  const categoryMap = createCategoryMap(categories)

  return {
    categories,
    categoryMap,
    events: data.events,
    affiches: data.affiches
  }
}