import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/exceptions/http-exception.filter';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users', () => {
    it('GET returns an array of users', async () => {
      const response = await request(app.getHttpServer()).get('/users');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('/users/:id', () => {
    it('GET returns a single user by id', async () => {
      const response = await request(app.getHttpServer()).get('/users/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('tax');
    });

    it('GET returns 404 for non-existing user', async () => {
      const response = await request(app.getHttpServer()).get('/users/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('message', 'User not found');
      expect(response.body).toHaveProperty('path', '/users/999');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('/users/:id/budget', () => {
    it('POST returns the total price of products for a given user and product ids', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/1/budget')
        .send({ products_id: [1, 2] });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('total_price', 16790.2);
    });

    it('POST returns 404 for non-existing user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/999/budget')
        .send({ products_id: [1, 2] });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('message', 'User not found');
      expect(response.body).toHaveProperty('path', '/users/999/budget');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('POST returns 404 for non-existing product', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/1/budget')
        .send({ products_id: [1, 999] });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('message', 'Product not found');
      expect(response.body).toHaveProperty('path', '/users/1/budget');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('/products', () => {
    it('GET returns an array of products', async () => {
      const response = await request(app.getHttpServer()).get('/products');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('/products/:id', () => {
    it('GET returns a single product by id', async () => {
      const response = await request(app.getHttpServer()).get('/products/1');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price');
    });

    it('GET returns 404 for non-existing product', async () => {
      const response = await request(app.getHttpServer()).get('/products/999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('statusCode', 404);
      expect(response.body).toHaveProperty('message', 'Product not found');
      expect(response.body).toHaveProperty('path', '/products/999');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
