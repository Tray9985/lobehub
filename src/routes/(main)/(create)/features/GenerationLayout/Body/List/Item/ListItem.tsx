'use client';

import type { GenericItemType } from '@lobehub/ui';
import { ActionIcon, DropdownMenu, Icon } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import { HashIcon, MoreHorizontalIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import NavItem from '@/features/NavPanel/components/NavItem';
import { useOverlayDropdownPortalProps } from '@/features/NavPanel/OverlayContainer';
import type { ImageGenerationTopic } from '@/types/generation';

import { useGenerationTopicContext } from '../StoreContext';

interface TopicItemProps {
  contextMenuItems?: GenericItemType[] | (() => GenericItemType[]);
  isActive?: boolean;
  isLoading?: boolean;
  isUpdating?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
  topic: ImageGenerationTopic;
}

const ListItem = memo<TopicItemProps>(
  ({ topic, style, isLoading, onClick, isActive, isUpdating, contextMenuItems }) => {
    const { namespace } = useGenerationTopicContext();
    const { t } = useTranslation(namespace);
    const dropdownPortalProps = useOverlayDropdownPortalProps();

    return (
      <NavItem
        active={isActive}
        contextMenuItems={contextMenuItems}
        disabled={isUpdating}
        key={topic.id}
        loading={isLoading || isUpdating}
        style={style}
        title={topic.title || t('topic.untitled')}
        actions={
          contextMenuItems ? (
            <DropdownMenu items={contextMenuItems} portalProps={dropdownPortalProps}>
              <ActionIcon icon={MoreHorizontalIcon} size="small" />
            </DropdownMenu>
          ) : undefined
        }
        icon={
          <Icon icon={HashIcon} size={'small'} style={{ color: cssVar.colorTextDescription }} />
        }
        onClick={onClick}
      />
    );
  },
);

export default ListItem;
