export const createCategoryMap = (categories) => {
  return categories.reduce((acc, cat) => {
    if (cat.id) acc[cat.id] = cat       
    if (cat._id) acc[cat._id] = cat     
    if (cat.slug) acc[cat.slug] = cat 
    return acc
  }, {})
}