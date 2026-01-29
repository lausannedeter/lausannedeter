export const createCategoryMap = (categories) => {
  return categories.reduce((acc, cat) => {
    acc[cat.id] = cat
    return acc
  }, {})
}