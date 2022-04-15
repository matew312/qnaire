import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import * as React from "react";
import { useScroll } from "../../hooks";

export default function Answer({ question, shouldScroll, children }) {
  const ref = React.useRef(null);
  useScroll(shouldScroll, ref);

  return (
    <Card ref={ref}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5">
            {question.text} {question.mandatory ? "*" : ""}
          </Typography>
          <Box>{children}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
