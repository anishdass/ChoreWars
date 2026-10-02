import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";
import Card from "../../components/Card";

const fallbackColors = ["#2563eb", "#db2777", "#0891b2", "#ea580c"];
const intensityLevels = [0.28, 0.48, 0.72, 1];

const shadeColor = (color, intensity) => {
  const hex = color.replace("#", "");
  const channels = [0, 2, 4].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16),
  );
  const shaded = channels.map((channel) =>
    Math.round(255 + (channel - 255) * intensity)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${shaded.join("")}`;
};

const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;

export default function ActivityHeatmap({
  activity = [],
  childProfiles = [],
}) {
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

  const colorByChild = new Map(
    childProfiles.map((child, index) => [
      child.id,
      child.color || fallbackColors[index % fallbackColors.length],
    ]),
  );
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
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
          }}>
          <Box>
            <Typography variant='h6' sx={{ color: "#1f2937" }}>
              Activity
            </Typography>
            <Typography variant='body2' sx={{ color: "#6b7280", mt: 0.5 }}>
              {totalCompletions} {totalCompletions === 1 ? "chore" : "chores"}{" "}
              completed in the last year
            </Typography>
          </Box>
          <Stack spacing={0.75} sx={{ alignItems: "flex-end" }}>
            <Stack
              direction='row'
              spacing={1.5}
              useFlexGap
              sx={{ flexWrap: "wrap" }}
              aria-label='Children activity colors'>
              {childProfiles.map((child, index) => (
                <Box
                  key={child.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                  }}>
                  <Box
                    aria-hidden='true'
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: 0.5,
                      bgcolor:
                        child.color ||
                        fallbackColors[index % fallbackColors.length],
                    }}
                  />
                  <Typography variant='caption' sx={{ color: "#6b7280" }}>
                    {child.firstName || child.name.split(/\s+/)[0]}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Typography variant='caption' sx={{ color: "#6b7280" }}>
              Darker dots mean more chores completed that day
            </Typography>
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
                sx={{
                  width: 22,
                  py: "1px",
                  justifyContent: "space-between",
                }}>
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
                    const completionsByChild = new Map();
                    entries.forEach((entry) => {
                      const current = completionsByChild.get(entry.userId) || [];
                      current.push(entry);
                      completionsByChild.set(entry.userId, current);
                    });
                    const mostActiveChild = [...completionsByChild.entries()]
                      .sort(([, first], [, second]) => second.length - first.length)[0];
                    const [childId, childEntries] = mostActiveChild || [];
                    const child = childProfiles.find(
                      (item) => item.id === childId,
                    );
                    const dayLabel = day.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                    const details = entries
                      .map((entry) => {
                        const owner = childProfiles.find(
                          (item) => item.id === entry.userId,
                        );
                        return `${entry.title}${owner ? ` — ${owner.firstName || owner.name.split(/\s+/)[0]}` : ""}`;
                      })
                      .join(", ");
                    const description = entries.length
                      ? `${dayLabel}: ${entries.length} ${
                          entries.length === 1 ? "chore" : "chores"
                        } completed${child ? ` — most activity by ${child.firstName || child.name.split(/\s+/)[0]}` : ""}: ${details}`
                      : `${dayLabel}: no chores completed`;
                    const intensity = childEntries
                      ? intensityLevels[
                          Math.min(childEntries.length, intensityLevels.length) - 1
                        ]
                      : 0;

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
                              : childEntries
                                ? shadeColor(
                                    colorByChild.get(childId) ||
                                      fallbackColors[0],
                                    intensity,
                                  )
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
      completedAt: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
    }),
  ),
  childProfiles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
    }),
  ),
};
