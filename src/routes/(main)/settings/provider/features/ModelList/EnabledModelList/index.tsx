import { ActionIcon, Center, Flexbox, Text, Tooltip, TooltipGroup } from '@lobehub/ui';
import { Switch } from 'antd';
import isEqual from 'fast-deep-equal';
import { ArrowDownUpIcon } from 'lucide-react';
import { use, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAiInfraStore } from '@/store/aiInfra';
import { aiModelSelectors } from '@/store/aiInfra/selectors';

import ModelItem from '../ModelItem';
import { ProviderSettingsContext } from '../ProviderSettingsContext';
import SortModelModal from '../SortModelModal';

interface EnabledModelListProps {
  activeTab: string;
}

const EnabledModelList = ({ activeTab }: EnabledModelListProps) => {
  const { t } = useTranslation('modelProvider');
  const { modelEditable } = use(ProviderSettingsContext);

  const enabledModels = useAiInfraStore(aiModelSelectors.enabledAiProviderModelList, isEqual);
  const allModels = useAiInfraStore(aiModelSelectors.filteredAiProviderModelList, isEqual);
  const batchToggleAiModels = useAiInfraStore((s) => s.batchToggleAiModels);
  const [open, setOpen] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);

  const isEmpty = enabledModels.length === 0;

  // Filter models based on active tab
  const filteredEnabledModels = useMemo(() => {
    if (activeTab === 'all') return enabledModels;
    return enabledModels.filter((model) => model.type === activeTab);
  }, [enabledModels, activeTab]);

  const filteredAllModels = useMemo(() => {
    if (activeTab === 'all') return allModels;
    return allModels.filter((model) => model.type === activeTab);
  }, [allModels, activeTab]);

  // Models that can be toggled (exclude embedding models when not editable)
  const togglableModels = useMemo(
    () =>
      modelEditable
        ? filteredAllModels
        : filteredAllModels.filter((model) => model.type !== 'embedding'),
    [filteredAllModels, modelEditable],
  );

  const togglableEnabledModels = useMemo(
    () =>
      modelEditable
        ? filteredEnabledModels
        : filteredEnabledModels.filter((model) => model.type !== 'embedding'),
    [filteredEnabledModels, modelEditable],
  );

  const checked = togglableEnabledModels.length > 0;
  const isCurrentTabEmpty = filteredEnabledModels.length === 0;
  return (
    <>
      <Flexbox horizontal justify={'space-between'}>
        <Text style={{ fontSize: 12, marginTop: 8 }} type={'secondary'}>
          {t('providerModels.list.enabled')}
        </Text>
        {togglableModels.length > 0 && (
          <TooltipGroup>
            <Flexbox horizontal>
              <Tooltip
                title={
                  checked
                    ? t('providerModels.list.enabledActions.disableAll')
                    : t('providerModels.list.enabledActions.enableAll')
                }
              >
                <Switch
                  checked={checked}
                  loading={batchLoading}
                  size={'small'}
                  onChange={async (enabled) => {
                    setBatchLoading(true);
                    await batchToggleAiModels(
                      togglableModels.map((i) => i.id),
                      enabled,
                    );
                    setBatchLoading(false);
                  }}
                />
              </Tooltip>

              {!isEmpty && (
                <ActionIcon
                  icon={ArrowDownUpIcon}
                  size={'small'}
                  title={t('providerModels.list.enabledActions.sort')}
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              )}
            </Flexbox>
          </TooltipGroup>
        )}
        {open && (
          <SortModelModal
            defaultItems={enabledModels}
            open={open}
            onCancel={() => {
              setOpen(false);
            }}
          />
        )}
      </Flexbox>

      {isEmpty ? (
        <Center padding={12}>
          <Text style={{ fontSize: 12 }} type={'secondary'}>
            {t('providerModels.list.enabledEmpty')}
          </Text>
        </Center>
      ) : isCurrentTabEmpty ? (
        <Center padding={12}>
          <Text style={{ fontSize: 12 }} type={'secondary'}>
            {t('providerModels.list.noModelsInCategory')}
          </Text>
        </Center>
      ) : (
        <TooltipGroup>
          <Flexbox gap={2}>
            {filteredEnabledModels.map(({ displayName, id, ...res }) => {
              const label = displayName || id;
              return (
                <ModelItem displayName={label as string} id={id as string} key={id} {...res} />
              );
            })}
          </Flexbox>
        </TooltipGroup>
      )}
    </>
  );
};
export default EnabledModelList;
