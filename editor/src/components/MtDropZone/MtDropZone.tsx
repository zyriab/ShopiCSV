import React from 'react';
import { useTranslation } from 'react-i18next';
import { DropZone } from '@shopify/polaris';

interface MtDropZoneProps {
  onUpload: (
    files: File[],
    acceptedFiles: File[],
    rejectedFiles: File[]
  ) => Promise<void>;
}

export function MtDropZone(props: MtDropZoneProps) {
  const { t } = useTranslation();

  return (
    <DropZone
      dropOnPage
      accept="text/csv"
      overlayText={t('DropZone.message')}
      allowMultiple={false}
      onDrop={(files, accepted, rejected) =>
        props.onUpload(files, accepted, rejected)
      }>
      <DropZone.FileUpload actionTitle={t('DropZone.message')} />
    </DropZone>
  );
}
