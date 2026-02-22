import events from '~/data/events.json'
import categories from '~/data/categories.json'
import affiches from '~/data/affiches.json'

export const useEvents = () => {
  const categoryMap = createCategoryMap(categories)

  return {
    categories,
    categoryMap,
    events: events,
    affiches: affiches
  }
}
