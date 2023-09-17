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
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Message } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import RoomMessagesUI from '../../../stores/ui/App/RoomPanel/RoomMessagesUI';
import { userInfoPanelUI } from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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
            <>
              <Typography>
                {message.user?.pseudonym}
                <Typography
                  component={'span'}
                  variant="caption"
                  color={'GrayText'}
                >
                  {'  ' + new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Typography>
            </>
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

const itemContent = (_index: number, message: Message) => {
  return <MessageRow message={message} />;
};

const RoomMessages = observer(({ store }: { store: RoomMessagesUI }) => {
  const ref = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    store.setRef(ref);
  });
  const startReached = () => {
    void store.fetchMore();
  };
  return (
    <Box bgcolor={theme.palette.grey[900]} flexGrow={1}>
      {!store.isLoading && (
        <Virtuoso
          ref={ref}
          overscan={600}
          computeItemKey={(_index, item) => item.id}
          data={store.messages}
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
