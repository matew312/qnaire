import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRequireAuth } from "../../auth";
import { GET } from "../../request";
import { useAppContext } from "../../providers/AppContextProvider";
import { useQnaireListController } from "../../controllers/useQnaireListController";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

export function QnairesPage() {
  const { qnaires, isLoaded } = useQnaireListController();

  const { setPageActions } = useAppContext();
  useEffect(() => setPageActions([]), []);

  if (!isLoaded) {
    return null;
  }

  return (
    <Grid container spacing={2} alignItems="stretch">
      {Object.values(qnaires).map((qnaire) => (
        <Grid item xs={12} sm={6} lg={4} key={qnaire.id}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {qnaire.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {qnaire.desc ? qnaire.desc.slice(0, 100).concat("...") : ""}
                </Typography>
              </CardContent>
            </CardActionArea>

            {qnaire.published ? (
              <CardActions>
                <Button size="small" color="primary">
                  Zrušit publikaci
                </Button>
                <Button size="small"  color="primary">
                  Získat odkaz
                </Button>
              </CardActions>
            ) : (
              <CardActions>
                <Button size="small" color="primary">
                  Publikovat
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
