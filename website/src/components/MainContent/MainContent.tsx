import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import EditorRow from '../EditorRow/EditorRow';
import FileExplorerRow from '../FileExplorerRow/FileExplorerRow';
import FiltersRow from '../FiltersRow/FiltersRow';
import CodeEditorRow from '../CodeEditorRow/CodeEditorRow';
import RoadmapRow from '../RoadmapRow/RoadmapRow';
import NewsletterRow from '../NewsletterRow/NewsletterRow';
import StoryRow from '../StoryRow/StoryRow';
import BackToTopBtn from '../BackToTopBtn/BackToTopBtn';
import LanguageSelector from '../LanguageSelector/LanguageSelector';

export default function MainContent() {
  return (
    <>
      <Stack>
        <EditorRow />
        <Box bgcolor="#dceee9" width="100%">
          <Stack>
            <Stack justifyContent="center">
              <Box mt={5} sx={{ textAlign: 'center' }}>
                <Typography variant="h3">Here's how it works</Typography>
                <Typography variant="h5">
                  Just upload your CSV file and you're good to go!
                </Typography>
              </Box>
            </Stack>
            <FileExplorerRow />
            <FiltersRow />
            <CodeEditorRow />
            <RoadmapRow />
            <NewsletterRow />
            <StoryRow />
          </Stack>
        </Box>
      </Stack>
      <BackToTopBtn />
      <LanguageSelector />
    </>
  );
}
