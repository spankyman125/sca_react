import { Box, useTheme } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso';
import RoomMessagesUI from '../../../stores/ui/App/RoomPanel/RoomMessagesUI';
import 'react-photo-view/dist/react-photo-view.css';
import { MessageRow } from './MessageRow';

const RoomMessages = observer(({ store }: { store: RoomMessagesUI }) => {
  const theme = useTheme();
  const itemContent = useCallback(
    (i: number) => (
      <MessageRow message={store.messages[i - store.firstItemIndex]} />
    ),
    [store],
  );

  const groupContent = useCallback(
    (groupIndex: number) => (
      <ListItem sx={{ backgroundColor: 'grey.900', justifyContent: 'center' }}>
        {store.dateGroups.dateGroupDates[groupIndex].toDateString()}
      </ListItem>
    ),
    [store],
  );

  const startReached = useCallback(() => {
    void store.fetchMore();
  }, [store]);

  return (
    <Box bgcolor={theme.palette.grey[900]} flexGrow={1}>
      {!store.isLoading && store.messages.length !== 0 && (
        <GroupedVirtuoso
          groupCounts={store.dateGroups.dateGroupCounts}
          groupContent={groupContent}
          ref={
            store.virtuosoRef as React.MutableRefObject<GroupedVirtuosoHandle>
          }
          overscan={600}
          followOutput={'smooth'}
          itemContent={itemContent}
          firstItemIndex={store.firstItemIndex}
          startReached={startReached}
          initialTopMostItemIndex={store.initialTopMostItemIndex}
          components={{
            Footer,
          }}
        />
      )}
    </Box>
  );
});

const Footer = () => {
  return (
    <div
      style={{
        padding: '15px',
      }}
    ></div>
  );
};

export default RoomMessages;
