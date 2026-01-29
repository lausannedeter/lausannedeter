export const groupAffichesByMonth = (affiches) => {
    return affiches.reduce((acc, affiche) => {
        const d = new Date(affiche.monthStart)
        const key = `${d.getFullYear()}-${d.getMonth()}`
        acc[key] = affiche
        return acc
    }, {})
}