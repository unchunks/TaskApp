import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TabbedView = ({ currentTab, setCurrentTab, groups }) => {
  const theme = useTheme();

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          '& .MuiTab-root': {
            minWidth: 100,
          },
        }}
      >
        <Tab label="すべて" value="all" />
        <Tab label="未完了" value="active" />
        <Tab label="完了済み" value="completed" />
        {groups.map((group) => (
          <Tab
            key={group.id}
            label={group.name}
            value={group.id}
            sx={{
              color: group.color,
              '&.Mui-selected': {
                color: group.color,
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default TabbedView;
