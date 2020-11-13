const reducer = (state = '', action) => {
  switch (action.type) {
    case 'UPDATE':
      return action.filter
    default:
      return state
  }
}

export const updateFilter = (newFilter) => {
  return {
    type: 'UPDATE',
    filter: newFilter
  }
}

export default reducer