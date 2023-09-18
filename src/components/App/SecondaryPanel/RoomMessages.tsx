import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Box,
  IconButton,
  ListItemAvatar,
  Typography,
  useTheme,
} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { observer } from 'mobx-react-lite';
import React, { memo, useCallback, useRef, useState } from 'react';
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso';
import { Message } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import { userInfoPanelUI } from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';
import RoomMessagesUI from '../../../stores/ui/App/RoomPanel/RoomMessagesUI';

const MessageRow = memo(({ message }: { message: Message }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <ListItem
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      component="div"
      disablePadding
      secondaryAction={
        hovered && (
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        )
      }
    >
      <ListItemButton
        alignItems="flex-start"
        onClick={() => void userInfoPanelUI.open(message.userId)}
      >
        <ListItemAvatar>
          <Avatar
            alt={message.user?.pseudonym}
            src={STATIC_URL + (message.user?.avatarUrl || '')}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography>
              {message.user?.pseudonym}
              <Typography
                component={'span'}
                variant="caption"
                color={'GrayText'}
              >
                {` ${new Date(message.createdAt).toTimeString().split(' ')[0]}`}
              </Typography>
            </Typography>
          }
          secondary={`${message.content} `}
          secondaryTypographyProps={{
            style: { whiteSpace: 'pre-wrap', wordWrap: 'break-word' },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
});

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
