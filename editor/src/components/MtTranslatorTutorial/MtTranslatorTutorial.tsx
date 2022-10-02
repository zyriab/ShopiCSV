import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import store from 'store2';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import themeContext from '../../utils/contexts/theme.context';
import Paper from '@mui/material/Paper';

interface MtTranslatorTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MtTranslatorTutorial(props: MtTranslatorTutorialProps) {
  const [step, setStep] = useState(0);

  const { isDark } = useContext(themeContext);
  const { t } = useTranslation();

  const content = [
    {
      title: t('Tutorial.firstTitle'),
      body: t('Tutorial.firstTxt'),
      img: 'images/tutorials/shopiCSVtutoSearch.svg',
    },
    {
      title: t('Tutorial.secondTitle'),
      body: t('Tutorial.secondTxt'),
      img: 'images/tutorials/shopiCSVtutoTopRightIcons.svg',
    },
    {
      title: t('Tutorial.thirdTitle'),
      body: t('Tutorial.thirdTxt'),
      img: 'images/tutorials/shopiCSVtutoDisplayRows.svg',
    },
    {
      title: t('Tutorial.fourthTitle'),
      body: t('Tutorial.fourthTxt'),
      img: 'images/tutorials/shopiCSVtutoDisplayPg.svg',
    },
  ];

  function handleClose() {
    store.set('openTutorial', false);
    props.onClose();
  }

  function handlePreviousClick() {
    setStep((current) => (current <= 0 ? 0 : current - 1));
  }

  function handleNextClick() {
    if (step >= content.length - 1) {
      handleClose();
      return;
    }

    setStep((current) => current + 1);
  }

  useEffect(() => {
    setStep(0);
  }, [props.isOpen]);

  return (
    <>
      {props.isOpen && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}>
          <Card sx={{ width: '50vw' }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="p">
                {content[step].title}
              </Typography>
            </CardContent>
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '25vw',
                maxHeight: '16.6vw',
                position: 'absolute',
                border: isDark ? '1px solid #e8e8e8' : '1px solid #202223',
                left: 0,
                right: 0,
                top: '10%',
                bottom: 0,
                margin: 'auto',
                padding: '10px',
                whiteSpace: 'pre-line',
                overflow: 'auto',
              }}>
              <div style={{ margin: 'auto', padding: 'inherit' }}>
                <Typography component="p">{content[step].body}</Typography>
              </div>
            </Paper>
            <CardMedia
              component="img"
              image={content[step].img}
              alt="Tutorial steps"
            />
            <CardActions sx={{ justifyContent: 'end' }}>
              <Typography sx={{ marginRight: '2ch' }}>
                {`${step + 1}/${content.length}`}
              </Typography>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handlePreviousClick}
                disabled={step <= 0}>
                {t('Tutorial.previous')}
              </Button>
              <Button
                variant="outlined"
                color={step >= content.length - 1 ? 'primary' : 'secondary'}
                size="small"
                onClick={handleNextClick}>
                {t(
                  step >= content.length - 1
                    ? 'Tutorial.close'
                    : 'Tutorial.next'
                )}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleClose}
                sx={{
                  visibility: step < content.length - 1 ? 'visible' : 'hidden',
                }}>
                {t('Tutorial.skip')}
              </Button>
            </CardActions>
          </Card>
        </Backdrop>
      )}
    </>
  );
}
