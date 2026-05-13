// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FileModel } from '@/database/models/file';
import { getServerDB } from '@/database/server';
import { FileService } from '@/server/services/file';

import { GET } from './route';

const mocks = vi.hoisted(() => ({
  getFullFileUrl: vi.fn(),
}));

vi.mock('@/database/models/file', () => ({
  FileModel: {
    getFileById: vi.fn(),
  },
}));

vi.mock('@/database/server', () => ({
  getServerDB: vi.fn(),
}));

vi.mock('@/envs/redis', () => ({
  getRedisConfig: vi.fn(() => ({})),
}));

vi.mock('@/libs/redis', () => ({
  initializeRedis: vi.fn(),
  isRedisEnabled: vi.fn(() => false),
}));

vi.mock('@/server/services/file', () => ({
  FileService: vi.fn(() => ({
    getFullFileUrl: mocks.getFullFileUrl,
  })),
}));

describe('GET /f/:id', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getServerDB).mockResolvedValue({} as any);
    mocks.getFullFileUrl.mockResolvedValue('https://resource.example.com/files/test.png');
  });

  it('redirects to the public file URL', async () => {
    vi.mocked(FileModel.getFileById).mockResolvedValue({
      id: 'file-id',
      url: 'files/test.png',
      userId: 'user-id',
    } as any);

    const response = await GET(new Request('https://lobehub.com/f/file-id'), {
      params: Promise.resolve({ id: 'file-id' }),
    });

    expect(FileModel.getFileById).toHaveBeenCalledWith(expect.anything(), 'file-id');
    expect(FileService).toHaveBeenCalledWith(expect.anything(), 'user-id');
    expect(mocks.getFullFileUrl).toHaveBeenCalledWith('files/test.png');
    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('https://resource.example.com/files/test.png');
  });

  it('returns 404 when file record is missing', async () => {
    vi.mocked(FileModel.getFileById).mockResolvedValue(undefined);

    const response = await GET(new Request('https://lobehub.com/f/missing'), {
      params: Promise.resolve({ id: 'missing' }),
    });

    expect(response.status).toBe(404);
    expect(mocks.getFullFileUrl).not.toHaveBeenCalled();
  });
});
