import React from 'react';
import { Card, Stack, Button, ButtonGroup } from '@shopify/polaris';
import {
  PlusMinor,
  ArrowUpMinor,
  // SortMinor,
  RefreshMinor,
} from '@shopify/polaris-icons';

export interface MtFileExplorerTopBarProps {
  onClickNewFolder: () => void;
  onClickUpload: () => void;
  onClickRefresh: () => Promise<void>;
}

export default function MtFileExplorerTopBar(props: MtFileExplorerTopBarProps) {
  return (
    <Card>
      <Card.Section flush>
        <div
          style={{padding: '1ch', width: '680px' }}>
          <Stack alignment="center" distribution="equalSpacing">
            <ButtonGroup segmented>
              <Button
                onClick={props.onClickNewFolder}
                icon={PlusMinor}
                size="slim">
                New folder
              </Button>
              <Button
                onClick={props.onClickUpload}
                icon={ArrowUpMinor}
                size="slim">
                Upload file
              </Button>
              {/* <Button icon={SortMinor} disclosure size="slim">
            Sort by
          </Button> */}
              <Button
                onClick={props.onClickRefresh}
                icon={RefreshMinor}
                size="slim"
              />
            </ButtonGroup>
          </Stack>
        </div>
      </Card.Section>
    </Card>
  );
}
