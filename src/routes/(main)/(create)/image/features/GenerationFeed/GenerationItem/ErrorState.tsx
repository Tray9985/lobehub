'use client';

import { Block, Button, Center, Icon, Text } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { ImageOffIcon, RotateCcw } from 'lucide-react';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import defaultErrorLocale from '@/locales/default/error';
import { AsyncTaskErrorType } from '@/types/asyncTask';
import { getRuntimeErrorMessage } from '@/utils/locale/runtimeErrorMessage';

import { ActionButtons } from './ActionButtons';
import { styles } from './styles';
import { type ErrorStateProps } from './types';
import { getThumbnailMaxWidth } from './utils';

const providerContentModerationErrorKeys = [
  'response.ProviderContentModeration',
  'response.ProviderContentModerationWarning',
  'response.ProviderImageContentModerationWarning',
] as const;

const providerContentModerationKeyByDefaultMessage = new Map<
  string,
  (typeof providerContentModerationErrorKeys)[number]
>(providerContentModerationErrorKeys.map((key) => [defaultErrorLocale[key], key]));

// Error state component
export const ErrorState = memo<ErrorStateProps>(
  ({ generation, generationBatch, aspectRatio, isRetrying, onDelete, onCopyError, onRetry }) => {
    const { t } = useTranslation('image');
    const { t: tError } = useTranslation(['error', 'modelRuntime']);

    const errorMessage = useMemo(() => {
      if (!generation.task.error) return '';

      const error = generation.task.error;
      const errorBody = typeof error.body === 'string' ? error.body : error.body?.detail;
      const translateErrorKey = (translationKey: string, fallbackKey?: string) => {
        const translated = tError(translationKey as any);

        // If translation key is not found, it returns the key itself.
        if (translated !== translationKey && !(translated as string).startsWith('response.')) {
          return translated as string;
        }

        if (!fallbackKey) return;

        // Try without any prefix for backwards compatibility with legacy error details.
        const directTranslated = tError(fallbackKey as any);
        return directTranslated !== fallbackKey ? (directTranslated as string) : undefined;
      };

      // Try to translate based on error type if it matches known AgentRuntimeErrorType
      if (errorBody) {
        if (errorBody.startsWith('response.')) {
          return translateErrorKey(errorBody) || errorBody;
        }

        const defaultMessageTranslationKey =
          providerContentModerationKeyByDefaultMessage.get(errorBody);
        if (defaultMessageTranslationKey) {
          return translateErrorKey(defaultMessageTranslationKey) || errorBody;
        }

        // Try the unified ERROR_CODE_SPECS-driven lookup (routes to either the
        // new `modelRuntime` namespace or legacy `error.response.<X>`).
        const runtimeMessage = getRuntimeErrorMessage(tError, errorBody);
        if (
          runtimeMessage &&
          runtimeMessage !== `modelRuntime:${errorBody}` &&
          runtimeMessage !== `response.${errorBody}`
        ) {
          return runtimeMessage;
        }
      }

      // Fallback to original error message
      return errorBody || error.name || 'Unknown error';
    }, [generation.task.error, tError]);

    const isProviderContentModerationError =
      generation.task.error?.name === AsyncTaskErrorType.ProviderContentModeration;

    return (
      <Block
        align={'center'}
        className={styles.placeholderContainer}
        justify={'center'}
        padding={16}
        variant={'filled'}
        style={{
          aspectRatio,
          cursor: 'pointer',
          maxWidth: getThumbnailMaxWidth(generation, generationBatch),
        }}
        onClick={onCopyError}
      >
        <Center gap={8}>
          <Icon color={cssVar.colorTextDescription} icon={ImageOffIcon} size={24} />
          <Text strong align={'center'} type={'secondary'}>
            {isProviderContentModerationError
              ? errorMessage || tError('response.ProviderContentModeration')
              : t('generation.status.failed')}
          </Text>
          {generation.task.error && !isProviderContentModerationError && (
            <Text
              code
              ellipsis={{ rows: 2 }}
              fontSize={10}
              title={t('generation.actions.copyError')}
              type={'secondary'}
              style={{
                wordBreak: 'break-all',
              }}
            >
              {errorMessage}
            </Text>
          )}
        </Center>
        <Button
          className={styles.retryButton}
          icon={RotateCcw}
          loading={isRetrying}
          size={'small'}
          variant={'outlined'}
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
        >
          {t('generation.actions.retry')}
        </Button>
        <ActionButtons onDelete={onDelete} />
      </Block>
    );
  },
);

ErrorState.displayName = 'ErrorState';
