const removeEmpty = (obj: Record<string, unknown>) => {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null))
}

export default removeEmpty
