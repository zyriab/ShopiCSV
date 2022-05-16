import React from 'react';
import { useTranslation } from 'react-i18next';
import { DropZone, Button, Stack, TextStyle, Card } from '@shopify/polaris';

interface MtDropZoneProps {
  onUpload: (
    files: File[],
    acceptedFiles: File[],
    rejectedFiles: File[]
  ) => Promise<void>;
}

// TODO: implement error handling (customValidator + banner w/ details) @see: https://polaris.shopify.com/components/actions/drop-zone#section-content-guidelines
export function MtDropZone(props: MtDropZoneProps) {
  const { t } = useTranslation();
  return (
    <div>
      <Card sectioned>
        <DropZone
          dropOnPage
          accept="text/csv"
          overlayText={t('DropZone.message')}
          allowMultiple={false}
          onDrop={(files, accepted, rejected) =>
            props.onUpload(files, accepted, rejected)
          }>
          <Stack vertical spacing="loose">
            <div />
            <Stack vertical alignment="center" spacing="extraTight">
              <img src="images/icons/UploadSpot.svg" alt="Upload a file" />
              <Button>{t('DropZone.button')}</Button>
              <div />
              <div />
              <div />
              <TextStyle variation="subdued">{t('DropZone.message')}</TextStyle>
            </Stack>
            <div />
          </Stack>
        </DropZone>
      </Card>
    </div>
  );
}
