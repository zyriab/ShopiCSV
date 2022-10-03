import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  HomeMinor,
  ArrowLeftMinor,
  ChevronLeftMinor,
  ChevronRightMinor,
} from '@shopify/polaris-icons';
import { ButtonGroup, Button, Stack, Tooltip } from '@shopify/polaris';
import formatPath from '../../utils/tools/fileExplorer/formatPath.utils';

import './MtFileExplorerBreadCrumbs.css';

interface MtFileExplorerBreadCrumbsProps {
  path: string[];
  onChange: (newPath: React.SetStateAction<string[]>) => void;
}

export default function MtFileExplorerBreadCrumbs(
  props: MtFileExplorerBreadCrumbsProps
) {
  const MAX_CRUMBS = 4;

  const [displayedPath, setDisplayedPath] = useState(props.path);
  const displayIndex = useRef(0);

  function handleBackButtonClick() {
    const previousBtn = displayedPath.length + displayIndex.current - 1;
    handleBreadCrumbsClick(previousBtn);
  }

  function handleHomeButtonClick() {
    displayIndex.current = 0;
    handleBreadCrumbsClick(0);
  }

  function handleBreadCrumbsClick(index: number) {
    if (index > props.path.length) {
      return;
    }

    if (index <= 0) {
      return props.onChange([]);
    }

    const offset = props.path.length - index;

    props.onChange((current) => {
      const tmp = [...current];
      for (let i = 0; i < offset; i++) {
        tmp.pop();
      }
      return tmp;
    });

    if (displayIndex.current > 0) {
      displayIndex.current -= offset;
    }
  }

  function handleLeftScrollClick() {
    if (props.path.length > MAX_CRUMBS && displayIndex.current > 0) {
      displayIndex.current -= 1;
      setDisplayedPath(
        props.path.slice(
          displayIndex.current,
          displayIndex.current + MAX_CRUMBS
        )
      );
    }
  }

  const handleRightScrollClick = useCallback(() => {
    if (
      props.path.length > MAX_CRUMBS &&
      displayIndex.current < props.path.length - MAX_CRUMBS
    ) {
      displayIndex.current += 1;
      setDisplayedPath(
        props.path.slice(
          displayIndex.current,
          displayIndex.current + MAX_CRUMBS
        )
      );
    }
  }, [props.path]);

  useEffect(() => {
    setDisplayedPath(
      props.path.slice(displayIndex.current, displayIndex.current + MAX_CRUMBS)
    );

    handleRightScrollClick();
  }, [handleRightScrollClick, props.path]);

  return (
    <Stack wrap={false}>
      <Button
        icon={ArrowLeftMinor}
        onClick={handleBackButtonClick}
        size="slim"
        outline
      />
      <ButtonGroup segmented>
        {props.path.length > MAX_CRUMBS && (
          <Button
            onClick={handleLeftScrollClick}
            size="slim"
            icon={ChevronLeftMinor}
            outline
          />
        )}
        <Button
          onClick={handleHomeButtonClick}
          pressed={props.path.length === 0}
          icon={HomeMinor}
          size="slim"
          outline
        />
        {displayedPath.map((p, i) => (
          <Tooltip key={i} content={p}>
            <Button
              id="MtBreadCrumbs-Btn"
              onClick={() =>
                handleBreadCrumbsClick(i + displayIndex.current + 1)
              }
              pressed={props.path.length === i + displayIndex.current + 1}
              size="slim"
              outline>
              {formatPath(p)}
            </Button>
          </Tooltip>
        ))}
        {props.path.length > MAX_CRUMBS && (
          <Button
            onClick={handleRightScrollClick}
            size="slim"
            icon={ChevronRightMinor}
            outline
          />
        )}
      </ButtonGroup>
    </Stack>
  );
}
