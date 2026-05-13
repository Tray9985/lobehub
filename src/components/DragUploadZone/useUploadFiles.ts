import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useVisualMediaUploadAbility } from '@/hooks/useVisualMediaUploadAbility';
import { useFileStore } from '@/store/file';

interface UseUploadFilesOptions {
  model?: string;
  provider?: string;
}

/**
 * Hook to handle file uploads with visual media support filtering.
 * Filters out image/video files if the model cannot receive them directly or via fallback.
 *
 * @param options - The model and provider to check for vision support
 * @returns handleUploadFiles - Callback to handle file uploads
 */
export const useUploadFiles = (options: UseUploadFilesOptions = {}) => {
  const { model = '', provider = '' } = options;
  const { t } = useTranslation('chat');
  const { message } = App.useApp();

  const { canUploadImage, canUploadVideo } = useVisualMediaUploadAbility(model, provider);
  const uploadFiles = useFileStore((s) => s.uploadChatFiles);

  const handleUploadFiles = useCallback(
    async (files: File[]) => {
      // Filter out visual files if the model cannot receive them directly or via fallback.
      const filteredFiles = files.filter((file) => {
        if (file.type.startsWith('image')) return canUploadImage;
        if (file.type.startsWith('video')) return canUploadVideo;
        return true;
      });

      const hasUnsupportedVisualFile = files.some((file) => {
        if (file.type.startsWith('image')) return !canUploadImage;
        if (file.type.startsWith('video')) return !canUploadVideo;
        return false;
      });

      if (hasUnsupportedVisualFile) {
        message.warning(t('upload.clientMode.visionNotSupported'));
      }

      if (filteredFiles.length > 0) {
        uploadFiles(filteredFiles);
      }
    },
    [canUploadImage, canUploadVideo, message, t, uploadFiles],
  );

  return { canUploadImage, canUploadVideo, handleUploadFiles };
};
