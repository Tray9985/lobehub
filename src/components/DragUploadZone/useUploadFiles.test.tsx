import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useVisualMediaUploadAbility } from '@/hooks/useVisualMediaUploadAbility';
import { useFileStore } from '@/store/file';

import { useUploadFiles } from './useUploadFiles';

const uploadChatFilesMock = vi.hoisted(() => vi.fn());
const warningMock = vi.hoisted(() => vi.fn());

vi.mock('antd', () => ({
  App: {
    useApp: () => ({ message: { warning: warningMock } }),
  },
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/hooks/useVisualMediaUploadAbility', () => ({
  useVisualMediaUploadAbility: vi.fn(),
}));

vi.mock('@/store/file', () => ({
  useFileStore: vi.fn(),
}));

describe('useUploadFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFileStore).mockImplementation((selector: any) =>
      selector({ uploadChatFiles: uploadChatFilesMock }),
    );
  });

  it('warns and skips image files when visual upload is unsupported', async () => {
    vi.mocked(useVisualMediaUploadAbility).mockReturnValue({
      canUploadImage: false,
      canUploadVideo: true,
    });

    const { result } = renderHook(() => useUploadFiles({ model: 'text-model', provider: 'test' }));
    const image = new File(['image'], 'image.png', { type: 'image/png' });

    await result.current.handleUploadFiles([image]);

    expect(warningMock).toHaveBeenCalledWith('upload.clientMode.visionNotSupported');
    expect(uploadChatFilesMock).not.toHaveBeenCalled();
  });

  it('keeps supported non-visual files when mixed with unsupported images', async () => {
    vi.mocked(useVisualMediaUploadAbility).mockReturnValue({
      canUploadImage: false,
      canUploadVideo: true,
    });

    const { result } = renderHook(() => useUploadFiles({ model: 'text-model', provider: 'test' }));
    const image = new File(['image'], 'image.png', { type: 'image/png' });
    const text = new File(['text'], 'note.txt', { type: 'text/plain' });

    await result.current.handleUploadFiles([image, text]);

    expect(warningMock).toHaveBeenCalledWith('upload.clientMode.visionNotSupported');
    expect(uploadChatFilesMock).toHaveBeenCalledWith([text]);
  });
});
