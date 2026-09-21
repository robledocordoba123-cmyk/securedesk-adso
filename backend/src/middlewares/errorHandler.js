function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

function centralizedErrorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, err.message);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Datos invalidos',
      detalles: err.issues.map((i) => ({ campo: i.path.join('.'), mensaje: i.message })),
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Error interno del servidor' : err.message,
  });
}

module.exports = { notFoundHandler, centralizedErrorHandler };
