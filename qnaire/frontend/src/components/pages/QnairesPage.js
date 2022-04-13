import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppContext } from "../../providers/AppContextProvider";
import { useQnaireListController } from "../../controllers/useQnaireListController";
import PublishQnaireDialog from "../PublishQnaireDialog";
import UnpublishDialogButton from "../UnpublishDialogButton";
import QnaireLinkDialog from "../QnaireLinkDialog";
import CreateQnaireDialog from "../CreateQnaireDialog";
import { PageAction } from "../../PageAction";

export function QnairesPage() {
  const { qnaires, isLoaded, update, getLink, create, error } =
    useQnaireListController();

  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { setPageActions } = useAppContext();
  useEffect(() => {
    const pageActions = [
      new PageAction("Vytvořit dotazník", <AddIcon />, () =>
        setShowCreateDialog(true)
      ),
    ];
    setPageActions(pageActions);
  }, []);

  const navigate = useNavigate();

  if (!isLoaded) {
    return null;
  }

  return (
    <React.Fragment>
      <Typography variant="h2" mb={2}>
        Moje dotazníky
      </Typography>
      <Grid container spacing={3} alignItems="stretch">
        {qnaires.map((qnaire) => (
          <Grid item xs={12} sm={6} key={qnaire.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "space-between",
              }}
            >
              <CardActionArea
                sx={{ flexGrow: 1 }}
                onClick={() => navigate(`/questionnaires/${qnaire.id}`)}
              >
                <CardContent sx={{ height: "100%" }}>
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
                  <UnpublishDialogButton
                    buttonProps={{ size: "small" }}
                    onConfirm={() => update(qnaire.id, { published: false })}
                  />
                  <QnaireLinkDialog getLink={() => getLink(qnaire.id)} />
                </CardActions>
              ) : (
                <CardActions>
                  <PublishQnaireDialog
                    buttonProps={{ size: "small" }}
                    name={qnaire.name}
                    isPrivate={qnaire.private}
                    isAnonymous={qnaire.anonymous}
                    onPublish={() => update(qnaire.id, { published: true })}
                  />
                </CardActions>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
      <CreateQnaireDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={create}
      />
    </React.Fragment>
  );
}
