export const createCategoryMap = (categories) => {
  return categories.reduce((acc, cat) => {
    acc[cat._id] = cat
    return acc
  }, {})
}
