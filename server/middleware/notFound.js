// 404 Not Found middleware for MedVault API

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export default notFound
