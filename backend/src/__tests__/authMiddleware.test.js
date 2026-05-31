// backend/src/__tests__/authMiddleware.test.js
// Tests unitaires — on mock JWT, pas de DB, pas de serveur Express

const jwt = require('jsonwebtoken');

// On charge le middleware directement
// Le fichier exporte protect comme module.exports et requireAdmin comme propriété
const protect = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/authMiddleware');

// JWT_SECRET utilisé dans les tests — doit correspondre à ce que le middleware lit
process.env.JWT_SECRET = 'test-secret-jest';

// Helper pour créer des objets req/res/next mock
function mockReqResNext(authHeader = null) {
  const req = {
    headers: authHeader ? { authorization: authHeader } : {},
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();
  return { req, res, next };
}

// ── Tests protect ─────────────────────────────────────────────────────────────

describe('protect middleware', () => {

  test('rejette si aucun header Authorization', () => {
    const { req, res, next } = mockReqResNext();
    protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acces refuse' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejette si header Authorization ne commence pas par "Bearer "', () => {
    const { req, res, next } = mockReqResNext('Basic abc123');
    protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Acces refuse' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejette si token JWT invalide', () => {
    const { req, res, next } = mockReqResNext('Bearer token-invalide');
    protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide' });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejette si token JWT expiré', () => {
    const expired = jwt.sign(
      { id: 'user123', role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: -1 } // déjà expiré
    );
    const { req, res, next } = mockReqResNext(`Bearer ${expired}`);
    protect(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide' });
    expect(next).not.toHaveBeenCalled();
  });

  test('appelle next() si token valide et injecte req.user', () => {
    const token = jwt.sign(
      { id: 'user123', role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { req, res, next } = mockReqResNext(`Bearer ${token}`);
    protect(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe('user123');
    expect(req.user.role).toBe('user');
  });

  test('injecte correctement le rôle admin dans req.user', () => {
    const token = jwt.sign(
      { id: 'admin1', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { req, res, next } = mockReqResNext(`Bearer ${token}`);
    protect(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user.role).toBe('admin');
  });
});

// ── Tests requireAdmin ────────────────────────────────────────────────────────

describe('requireAdmin middleware', () => {

  test('rejette si req.user est absent', () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Acces reserve aux administrateurs',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('rejette si rôle est "user"', () => {
    const req = { user: { role: 'user' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('appelle next() si rôle est "admin"', () => {
    const req = { user: { role: 'admin' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});