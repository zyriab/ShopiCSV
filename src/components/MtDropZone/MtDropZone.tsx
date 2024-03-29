import React, { useContext, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
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
import formatBytes from '../../utils/tools/formatBytes.utils';
import getExpectedHeaderContent from '../../utils/tools/getExpectedHeaderContent.utils';
import themeContext from '../../utils/contexts/theme.context';
import { DataType } from '../../definitions/custom.d';

interface MtDropZoneProps {
  onUpload: (files: File[]) => Promise<void>;
  dataType: DataType;
}

type UploadError = 'InvalidType' | 'InvalidSize' | 'InvalidHeaderContent';

export function MtDropZone(props: MtDropZoneProps) {
  const MAX_FILE_SIZE = 10485760; // 10Mib

  const [errorType, setErrorType] = useState<UploadError>();
  const [hasError, setHasError] = useState(false);
  const [rejectedFiles, setRejectedFiles] = useState<File[]>([]);

  const { t } = useTranslation();
  const { themeStr } = useContext(themeContext);

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
        if (
          file.data[0].toString() !==
          getExpectedHeaderContent(
            props.dataType,
            file.data[0].length
          ).toString()
        ) {
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
    <CustomProperties style={{ whiteSpace: 'pre-line' }} colorScheme={themeStr}>
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
