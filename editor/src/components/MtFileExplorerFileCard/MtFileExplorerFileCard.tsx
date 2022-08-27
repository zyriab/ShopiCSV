import React, { useState, useEffect, useCallback } from 'react';
import { Stack, Card, Scrollable, EmptyState } from '@shopify/polaris';
import MtFileExplorerObject from '../MtFileExplorerObject/MtFileExplorerObject';
import MtBreadCrumbs from '../MtFileExplorerBreadCrumbs/MtFileExplorerBreadCrumbs';
import isDirectory from '../../utils/tools/fileExplorer/isDirectory.utils';
import formatPath from '../../utils/tools/fileExplorer/formatPath.utils';
import getPathRelativeName from '../../utils/tools/fileExplorer/getPathRelativeName.utils';
import { BucketObject } from '../../definitions/mtFileExplorer';

export interface MtFileExplorerFileCardProps {
  content: BucketObject[];
  selected: string | undefined;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
  path: string[];
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  onClickUpload: () => void;
  // TODO: implement sorting
}

export default function MtFileExplorerFileCard(
  props: MtFileExplorerFileCardProps
) {
  const [content, setContent] = useState<React.ReactElement[]>([]);

  const resetSelection = useCallback(() => {
    props.setSelected(undefined);
  }, [props]);

  const handleClick = useCallback(
    (id: string) => {
      const doubleClicked = id === props.selected;

      if (doubleClicked) {
        const obj = props.content.find((x) => x.id === id);

        if (obj && isDirectory(getPathRelativeName(obj.name, props.path))) {
          resetSelection();
          return props.setPath((current) => [
            ...current,
            ...[getPathRelativeName(obj.name, props.path)],
          ]);
        }
        return;
      }

      props.setSelected(id);
    },
    [props, resetSelection]
  );

  const getContent = useCallback(() => {
    const content = props.content.filter(
      (obj) => obj.name !== props.path.at(-1)
    );
    const rootFiles: React.ReactElement[] = [];
    const rootDirs: React.ReactElement[] = [];

    content.forEach((o) => {
      const name = getPathRelativeName(o.name, props.path);
      const path = props.path;
      const isDir = isDirectory(name);

      const objEl = (
        <MtFileExplorerObject
          {...o}
          key={o.id}
          name={name}
          path={path.join('/')}
          selected={props.selected === o.id}
          onClick={() => handleClick(o.id)}
        />
      );

      if (o.name.includes(props.path.join('/'))) {
        if (isDir) {
          if (!rootDirs.find((x) => formatPath(x.props['name']) === name)) {
            rootDirs.push(objEl);
          }
        } else {
          rootFiles.push(objEl);
        }
      }
    });

    return [...rootDirs, ...rootFiles];
  }, [handleClick, props.path, props.content, props.selected]);

  useEffect(() => {
    setContent(getContent());
  }, [getContent, props.path]);

  return (
    <Card>
      <Card.Section>
        <div onClick={resetSelection}>
          <Stack vertical>
            <Stack.Item>
              <MtBreadCrumbs path={props.path} onChange={props.setPath} />
            </Stack.Item>
            {content.length > 0 ? (
              <Stack.Item>
                <Scrollable
                  style={{ height: '320px', width: '640px', padding: '1%' }}>
                  <Stack spacing="tight" wrap>
                    {content}
                  </Stack>
                </Scrollable>
              </Stack.Item>
            ) : (
              <Stack.Item fill>
                {/* <div style={{ width: '640px' }}> */}
                <div>
                  <EmptyState
                    heading="No files yet"
                    action={{
                      content: 'Upload a file',
                      onAction: () => props.onClickUpload(),
                    }}
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png">
                    Upload a file to get started.
                  </EmptyState>
                </div>
              </Stack.Item>
            )}
          </Stack>
        </div>
      </Card.Section>
    </Card>
  );
}