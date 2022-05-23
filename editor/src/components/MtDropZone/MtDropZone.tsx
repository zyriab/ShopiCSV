import React, { useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import useDarkMode from '../../utils/hooks/useDarkMode';
import {
  DropZone,
  Button,
  Stack,
  TextStyle,
  Card,
  Banner,
  List,
  CustomProperties,
  Link,
} from '@shopify/polaris';
import Papa from 'papaparse';
import { formatBytes } from '../../utils/tools/formatBytes.utils';

interface MtDropZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  dataType: DataType;
}

type DataType = 'Translations' | 'Products';

type UploadError =
  | 'InvalidType'
  | 'InvalidSize'
  | 'InvalidColNumber'
  | 'InvalidHeaderContent';

export function MtDropZone(props: MtDropZoneProps) {
  const MAX_FILE_SIZE = 10485760; // 10Mib
  const EXPECTED_HEADER_CONTENT =
    props.dataType === 'Translations'
      ? [
          'Type',
          'Identification',
          'Field',
          'Locale',
          'Status',
          'Default content',
          'Translated content',
        ]
      : [];

  const [errorType, setErrorType] = useState<UploadError>();
  const [hasError, setHasError] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);

  const { t } = useTranslation();
  const { isDark } = useDarkMode();

  async function handleUpload(
    files: File[],
    accepted: File[],
    rejected: File[]
  ) {
    if (rejected.length > 0) {
      return;
    }

    Papa.parse<string[]>(accepted[0], {
      preview: 1,
      complete: async (file) => {
        if (file.data[0].length !== 7) {
          setRejectedFiles((current) => [...current, accepted[0]]);
          setErrorType('InvalidColNumber');
          setHasError(true);
          return;
        }

        if (file.data[0].toString() !== EXPECTED_HEADER_CONTENT.toString()) {
          setRejectedFiles((current) => [...current, accepted[0]]);
          setErrorType('InvalidHeaderContent');
          setHasError(true);
          return;
        }

        setHasError(false);
        props.onUpload(accepted);
      },
    });
  }

  function handleValidateUpload(file: File) {
    setRejectedFiles([]);
    setErrorType(undefined);

    if (file.type !== 'text/csv') {
      setErrorType('InvalidType');
      setRejectedFiles((current) => [...current, file]);
      setHasError(true);
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorType('InvalidSize');
      setRejectedFiles((current) => [...current, file]);
      setHasError(true);
      return false;
    }

    return true;
  }

  const errorMessage = hasError && (
    <CustomProperties
      style={{ whiteSpace: 'pre-line' }}
      colorScheme={isDark ? 'dark' : 'light'}>
      <Banner title={t('DropZone.bannerTitle')} status="critical">
        <List type="bullet">
          {rejectedFiles.map((file, index) => {
            const { name, size } = file;

            return (
              <List.Item key={index}>
                {errorType === 'InvalidType' && (
                  <p>{t('DropZone.wrongType', { name })}</p>
                )}
                {errorType === 'InvalidSize' && (
                  <p>
                    {t('DropZone.fileTooBig', {
                      name,
                      size: formatBytes(size),
                      maxFileSize: formatBytes(MAX_FILE_SIZE),
                    })}
                  </p>
                )}
                {errorType === 'InvalidColNumber' && (
                  <p>
                    {t('DropZone.invalidColNumber', {
                      name,
                      expectedColNumber: 7,
                    })}
                  </p>
                )}
                {errorType === 'InvalidHeaderContent' && (
                  <Trans i18nKey="DropZone.invalidHeaderContent">
                    "{{ name }}" is not supported. Make sure the first row
                    contains the name of each columns, without typo. For more
                    information, check out the{' '}
                    <Link
                      external
                      url="https://www.shopicsv.app/help/file-format#header-content">
                      supported files' structure
                    </Link>
                    .
                  </Trans>
                )}
              </List.Item>
            );
          })}
        </List>
      </Banner>
    </CustomProperties>
  );

  return (
    <Stack vertical>
      {errorMessage}
      <Card sectioned>
        <DropZone
          dropOnPage
          overlayText={t('DropZone.message')}
          allowMultiple={false}
          customValidator={handleValidateUpload}
          onDrop={handleUpload}>
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
    </Stack>
  );
}
