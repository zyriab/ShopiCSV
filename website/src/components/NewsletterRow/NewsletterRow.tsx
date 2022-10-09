import React, { useState } from 'react';
import useDetectBreakpoints from '../../utils/hooks/useDetectMUIBreakpoints';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';

// @ts-ignore
import blob from '../../images/newsletter-blob.png';

const occupations = [
  'A Shopify merchant',
  'A freelance translator',
  'A hobbyist',
];

export default function NewsletterRow() {
  const [occupation, setOccupation] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdatesOptIn, setIsUpdatesOptIn] = useState(false);

  const { isXs, isSm } = useDetectBreakpoints();

  function handleSubmit() {
    console.log(occupation);
    console.log(email);
  }

  function handleOccupationChange(event: SelectChangeEvent) {
    setOccupation(event.target.value as string);
  }

  return (
    <Box
      id="newsletter"
      mt={10}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        backgroundImage: `url(${blob})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
      }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          <div>
            <Typography variant="h3" align="center">
              Ready to save time?
            </Typography>
            <Typography variant="h4" align="center">
              Sign up to our newsletter to know when ShopiCSV will be available!
            </Typography>
          </div>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: isXs || isSm ? '70%' : '33%' }}>
                <Stack spacing={1}>
                  <FormControl sx={{ width: '60%' }}>
                    <InputLabel id="occupation">I am...</InputLabel>
                    <Select
                      labelId="occupation"
                      label="I am..."
                      value={occupation}
                      onChange={handleOccupationChange}>
                      {occupations.map((o) => (
                        <MenuItem key={o} value={o}>
                          {o}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    placeholder="youremail@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={isUpdatesOptIn}
                          onChange={(e) => setIsUpdatesOptIn(e.target.checked)}
                        />
                      }
                      label="Also keep me updated on new Shopify tools by Metaoist Dsgn"
                    />
                  </FormGroup>
                  <Box sx={{ width: '100%' }}>
                    <Button
                      onClick={handleSubmit}
                      variant="contained"
                      size="large"
                      disableElevation>
                      Sign me up!
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
            <Typography align="center" variant="subtitle2">
              We promise you'll only receive content related to ShopiCSV and
              your mail won't end up in the wrong hands (no spam either)
            </Typography>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
}
