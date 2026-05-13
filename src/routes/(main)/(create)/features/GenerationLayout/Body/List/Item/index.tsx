'use client';

import type { MenuProps } from '@lobehub/ui';
import { Icon } from '@lobehub/ui';
import { App } from 'antd';
import { PencilLine, Trash, Wand2 } from 'lucide-react';
import type { CSSProperties } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { openRenameModal } from '@/components/RenameModal';
import type { ImageGenerationTopic } from '@/types/generation';

import { useGenerationTopicContext } from '../StoreContext';
import ListItem from './ListItem';

interface TopicItemProps {
  style?: CSSProperties;
  topic: ImageGenerationTopic;
}

const TopicItem = memo<TopicItemProps>(({ topic, style }) => {
  const { useStore, namespace } = useGenerationTopicContext();
  const { t } = useTranslation(namespace);
  const { t: tTopic } = useTranslation('topic');
  const { modal } = App.useApp();
  const isLoading = useStore((s) => s.loadingGenerationTopicIds.includes(topic.id));
  const autoRenameGenerationTopicTitle = useStore((s) => s.autoRenameGenerationTopicTitle);
  const removeGenerationTopic = useStore((s) => s.removeGenerationTopic);
  const switchGenerationTopic = useStore((s) => s.switchGenerationTopic);
  const updateGenerationTopicTitle = useStore((s) => s.updateGenerationTopicTitle);
  const activeTopicId = useStore((s) => s.activeGenerationTopicId);

  const isActive = activeTopicId === topic.id;

  const handleClick = () => {
    switchGenerationTopic(topic.id);
  };

  const menuItems: MenuProps['items'] = [
    {
      icon: <Icon icon={Wand2} />,
      key: 'autoRename',
      label: tTopic('actions.autoRename'),
      onClick: () => {
        autoRenameGenerationTopicTitle(topic.id);
      },
    },
    {
      icon: <Icon icon={PencilLine} />,
      key: 'rename',
      label: t('rename', { ns: 'common' }),
      onClick: () => {
        openRenameModal({
          defaultValue: topic.title || t('topic.untitled'),
          description: t('renameModal.description', { ns: 'topic' }),
          onSave: async (newTitle) => {
            await updateGenerationTopicTitle(topic.id, newTitle);
          },
          title: t('renameModal.title', { ns: 'topic' }),
        });
      },
    },
    {
      type: 'divider' as const,
    },
    {
      danger: true,
      icon: <Icon icon={Trash} />,
      key: 'delete',
      label: t('delete', { ns: 'common' }),
      onClick: () => {
        modal.confirm({
          cancelText: t('cancel', { ns: 'common' }),
          content: t('topic.deleteConfirmDesc'),
          okButtonProps: { danger: true },
          okText: t('delete', { ns: 'common' }),
          onOk: async () => {
            try {
              await removeGenerationTopic(topic.id);
            } catch (error) {
              console.error('Delete topic failed:', error);
            }
          },
          title: t('topic.deleteConfirm'),
        });
      },
    },
  ];

  return (
    <ListItem
      contextMenuItems={menuItems}
      isActive={isActive}
      isLoading={isLoading}
      style={style}
      topic={topic}
      onClick={handleClick}
    />
  );
});

TopicItem.displayName = 'TopicItem';

export default TopicItem;
