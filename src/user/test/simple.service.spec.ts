import { Test } from '@nestjs/testing';
import { SimpleService } from '../simple.service';
import { describe } from 'node:test';

describe('SimpleService', () => {
  let service: SimpleService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [SimpleService],
    }).compile();

    service = module.get(SimpleService);
  });

  it('bootstrap', () => {
    expect(service).toBeDefined();
  });

  describe('testMe()', () => {
    describe('when called', () => {
      let result: number;

      beforeEach(() => (result = service.testMe(5)));

      it('should return number', () => {
        expect(typeof result).toBe('number');
      });

      it('should return number + 1', () => {
        expect(result).toBe(6);
      });
    });
  });

  describe('testMeWithMocks', () => {
    describe('when called', () => {
      let result: number;

      beforeEach(() => {
        jest.spyOn(service, 'getRandom').mockReturnValue(2);
        result = service.testMeWithMocks(5);
      });

      afterAll(() => {
        jest.restoreAllMocks();
      });

      test('getRandom() should be called', () => {
        expect(service.getRandom).toHaveBeenCalled();
        expect(service.getRandom).toHaveLastReturnedWith(2);
      });

      it('should return number', () => {
        expect(typeof result).toBe('number');
      });

      it('should return number + 2', () => {
        expect(result).toBe(7);
      });
    });
  });
});
