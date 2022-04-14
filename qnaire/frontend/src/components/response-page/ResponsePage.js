import { Button, Grid, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQnaireResponseController } from "../../controllers/useQnaireResponseController";
import { useAppContext } from "../../providers/AppContextProvider";

const QnaireInfo = ({ name, desc }) => (
  <Box mb={4}>
    <Typography variant="h2" component="h1">
      {name}
    </Typography>
    <Typography>{desc}</Typography>
  </Box>
);

const SectionInfo = ({ name, desc }) => (
  <Box>
    <Typography variant="h3" component="h2">
      {name}
    </Typography>
    <Typography>{desc}</Typography>
  </Box>
);

export function ResponsePage() {
  const { id, privateId } = useParams();
  //check if privateId undefined and handle accordingly (based on whether qnaire is aunonymous)

  const [searchParams, setSearchParams] = useSearchParams();
  const isPreview = Boolean(searchParams.has("preview"));

  const {
    isLoaded,
    qnaire,
    currentSection,
    isIntro,
    isLastSection,
    goToNextSection,
    goToPreviousSection,
    submitResponse,
    isDone,
  } = useQnaireResponseController(id, privateId, isPreview);

  const { setPageActions, setDrawerDisabled } = useAppContext();

  useEffect(() => {
    setPageActions([]);
    setDrawerDisabled(true);

    return () => setDrawerDisabled(false);
  }, []);

  if (!isLoaded) {
    return null;
  }

  if(isDone) {
    return <Typography variant="h4" >Odpověď byla úspěšně odeslána.</Typography>
  }

  return (
    <Stack spacing={2}>
      {isIntro ? (
        <QnaireInfo {...qnaire} />
      ) : (
        <SectionInfo {...currentSection} />
      )}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {!isIntro && (
          <Button variant="outlined" onClick={goToPreviousSection}>
            Zpět
          </Button>
        )}
        {!isLastSection ? (
          <Button variant="outlined" onClick={goToNextSection}>
            Pokračovat
          </Button>
        ) : (
          <Button variant="contained" onClick={submitResponse}>
            Odeslat
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
