import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: 'test-user',
        email: 'test@example.com'
      },
      token: 'fake-jwt-token'
    });
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      user: {
        id: 'new-user',
        email: 'new@example.com'
      },
      token: 'fake-jwt-token'
    });
  }),

  http.post('/api/auth/reset-password', () => {
    return HttpResponse.json({ 
      message: 'Password reset email sent' 
    });
  }),

  http.get('/api/readings', () => {
    return HttpResponse.json([
      {
        id: '1',
        spreadType: 'celtic-cross',
        createdAt: '2024-01-15T12:00:00Z',
        cards: []
      }
    ]);
  })
];