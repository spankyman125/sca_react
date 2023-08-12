import { Avatar, Box, ListItemAvatar, useTheme } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Message } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import RoomMessagesUI from '../../../stores/ui/App/RoomPanel/RoomMessagesUI';

const MessageRow = memo(({ message }: { message: Message }) => {
  return (
    <ListItem component="div" disablePadding>
      <ListItemButton alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt={message.user?.pseudonym}
            src={STATIC_URL + (message.user?.avatarUrl || '')}
          />
        </ListItemAvatar>
        <ListItemText
          primary={`${message.user?.pseudonym || ''}`}
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
