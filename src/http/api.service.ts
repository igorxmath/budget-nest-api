import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  async fetchData(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new HttpException(response.statusText, response.status);
      }
      return await response.json();
    } catch (error) {
      throw new HttpException('fetch failed', 500);
    }
  }
}
