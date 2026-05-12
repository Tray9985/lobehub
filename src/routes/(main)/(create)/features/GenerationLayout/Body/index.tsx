'use client';

import { Accordion, AccordionItem, Flexbox, Text } from '@lobehub/ui';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '@/store/user';
import { authSelectors } from '@/store/user/slices/auth/selectors';

import type { GenerationLayoutCommonProps } from '../types';
import List from './List';

enum GroupKey {
  Topics = 'topics',
}

const Body = memo<GenerationLayoutCommonProps>((props) => {
  const { namespace, useStore, generationTopicsSelector } = props;
  const { t } = useTranslation(namespace);
  const isLogin = useUserStore(authSelectors.isLogin);

  const useFetchGenerationTopics = useStore((s: any) => s.useFetchGenerationTopics);
  useFetchGenerationTopics(!!isLogin);

  const generationTopics = useStore(generationTopicsSelector);
  const count = generationTopics?.length || 0;

  return (
    <Flexbox gap={1} paddingInline={4}>
      <Accordion defaultExpandedKeys={[GroupKey.Topics]} gap={2}>
        <AccordionItem
          itemKey={GroupKey.Topics}
          paddingBlock={4}
          paddingInline={'8px 4px'}
          title={
            <Text ellipsis fontSize={12} type={'secondary'} weight={500}>
              {t('topic.title')}
              {count > 0 && ` ${count}`}
            </Text>
          }
        >
          <List namespace={namespace} useStore={useStore} />
        </AccordionItem>
      </Accordion>
    </Flexbox>
  );
});

Body.displayName = 'GenerationLayoutBody';

export default Body;
