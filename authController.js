// ...existing code...

function loginUser(req, res) {
  try {
    // ...existing login logic...
  } catch (err) {
    console.error('authController error:', err);
    // Updated error handling as per FAILING_TESTS_LOG.md recommendations
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

// ...existing code...
