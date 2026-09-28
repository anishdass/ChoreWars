import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import Card from "../../components/Card";

const difficultyColors = {
  Easy: "#bbf7d0",
  Medium: "#4ade80",
  Hard: "#15803d",
};

const difficultyOrder = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export default function ActivityHeatmap({ activity = [] }) {
  const [today] = useState(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return currentDate;
  });

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const weeks = [];
  const date = new Date(startDate);
  while (date <= today) {
    const week = [];
    for (let day = 0; day < 7; day += 1) {
      week.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    weeks.push(week);
  }

  const activityByDay = new Map();
  activity.forEach((item) => {
    const completedDate = new Date(item.completedAt);
    if (Number.isNaN(completedDate.getTime())) return;
    completedDate.setHours(0, 0, 0, 0);
    if (completedDate < startDate || completedDate > today) return;

    const key = dateKey(completedDate);
    const entries = activityByDay.get(key) || [];
    entries.push(item);
    activityByDay.set(key, entries);
  });

  const totalCompletions = [...activityByDay.values()].reduce(
    (total, entries) => total + entries.length,
    0,
  );
  const columnTemplate = `repeat(${weeks.length}, 12px)`;
  const monthLabels = weeks.map((week, index) => {
    const currentMonth = week[0].getMonth();
    const previousMonth = weeks[index - 1]?.[0].getMonth();
    return currentMonth !== previousMonth
      ? { index, label: week[0].toLocaleDateString(undefined, { month: "short" }) }
      : null;
  });

  return (
    <Card>
      <Stack spacing={2}>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='flex-start'
          gap={2}
          flexWrap='wrap'>
          <Box>
            <Typography variant='h6' sx={{ color: "#1f2937" }}>
              Activity
            </Typography>
            <Typography variant='body2' sx={{ color: "#6b7280", mt: 0.5 }}>
              {totalCompletions} {totalCompletions === 1 ? "chore" : "chores"}{" "}
              completed in the last year
            </Typography>
          </Box>
          <Stack
            direction='row'
            spacing={1.5}
            flexWrap='wrap'
            useFlexGap
            aria-label='Chore difficulty legend'>
            {Object.entries(difficultyColors).map(([difficulty, color]) => (
              <Box
                key={difficulty}
                display='flex'
                alignItems='center'
                gap={0.75}>
                <Box
                  aria-hidden='true'
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: 0.5,
                    bgcolor: color,
                  }}
                />
                <Typography variant='caption' sx={{ color: "#6b7280" }}>
                  {difficulty}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ overflowX: "auto", pb: 0.5 }}>
          <Box sx={{ width: "max-content" }}>
            <Box
              aria-hidden='true'
              sx={{
                display: "grid",
                gridTemplateColumns: columnTemplate,
                columnGap: "3px",
                ml: "30px",
                mb: 1,
              }}>
              {monthLabels.map((month, index) => (
                <Typography
                  key={index}
                  variant='caption'
                  sx={{
                    gridColumn: index + 1,
                    color: "#6b7280",
                    fontSize: 10,
                    whiteSpace: "nowrap",
                  }}>
                  {month?.label}
                </Typography>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Stack
                aria-hidden='true'
                justifyContent='space-between'
                sx={{ width: 22, py: "1px" }}>
                {["", "Mon", "", "Wed", "", "Fri", ""].map((label, index) => (
                  <Typography
                    key={index}
                    variant='caption'
                    sx={{ height: 12, lineHeight: "12px", color: "#9ca3af", fontSize: 9 }}>
                    {label}
                  </Typography>
                ))}
              </Stack>
              <Box
                role='group'
                aria-label='Daily chore activity over the last year'
                sx={{
                  display: "grid",
                  gridAutoFlow: "column",
                  gridTemplateRows: "repeat(7, 12px)",
                  gridTemplateColumns: columnTemplate,
                  gap: "3px",
                }}>
                {weeks.flatMap((week) =>
                  week.map((day) => {
                    const entries = activityByDay.get(dateKey(day)) || [];
                    const mostDifficultEntry = entries.reduce(
                      (hardest, entry) =>
                        (difficultyOrder[entry.difficulty] || 0) >
                        (difficultyOrder[hardest?.difficulty] || 0)
                          ? entry
                          : hardest,
                      null,
                    );
                    const dayLabel = day.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                    const details = entries
                      .map((entry) => `${entry.title} (${entry.difficulty})`)
                      .join(", ");
                    const description = entries.length
                      ? `${dayLabel}: ${entries.length} ${
                          entries.length === 1 ? "chore" : "chores"
                        } completed — ${details}`
                      : `${dayLabel}: no chores completed`;

                    return (
                      <Box
                        key={dateKey(day)}
                        title={description}
                        aria-label={description}
                        aria-hidden={day > today ? "true" : undefined}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: 0.5,
                          bgcolor:
                            day > today
                              ? "transparent"
                              : mostDifficultEntry
                                ? difficultyColors[
                                    mostDifficultEntry.difficulty
                                  ] || difficultyColors.Easy
                                : "#f3f4f6",
                          outline:
                            day > today
                              ? "none"
                              : "1px solid rgba(107,114,128,0.12)",
                        }}
                      />
                    );
                  }),
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {totalCompletions === 0 && (
          <Typography variant='caption' sx={{ color: "#6b7280" }}>
            Claim a quest to start building your activity history.
          </Typography>
        )}
      </Stack>
    </Card>
  );
}

ActivityHeatmap.propTypes = {
  activity: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      difficulty: PropTypes.oneOf(["Easy", "Medium", "Hard"]).isRequired,
      completedAt: PropTypes.string.isRequired,
    }),
  ),
};
