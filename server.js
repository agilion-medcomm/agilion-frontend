// json-server custom auth endpoint for development/testing
// Install: npm install json-server
// Run: node server.js
const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// POST /api/auth/login
server.post('/api/auth/login', (req, res) => {
  const { tcKimlik, password } = req.body;
  if (!tcKimlik || !password) {
    return res.status(400).jsonp({ message: 'tcKimlik ve password gerekli.' });
  }

  const users = router.db.get('users').value();
  const user = users.find(u => u.tcKimlik === tcKimlik && u.password === password);

  if (!user) {
    return res.status(401).jsonp({ message: 'TC veya şifre yanlış.' });
  }

  const { password: pw, ...userWithoutPassword } = user;
  const mockToken = `mock-token-${user.id}-${Date.now()}`;

  return res.status(200).jsonp({
    token: mockToken,
    user: userWithoutPassword
  });
});

// mount router under /api
server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server with auth running at http://localhost:${PORT}/api`);
});