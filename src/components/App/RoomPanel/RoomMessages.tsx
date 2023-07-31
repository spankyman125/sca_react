import { useTheme } from '@emotion/react';
import { Avatar, ListItemAvatar } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Message } from '../../../api/http/interfaces';
import RoomMessagesUI from '../../../stores/ui/App/RoomPanel/RoomMessagesUI';

const MessageRow = memo(({ message }: { message: Message }) => {
  return (
    <ListItem component="div" disablePadding>
      <ListItemButton alignItems="flex-start">
        <ListItemAvatar>
          <Avatar
            alt={message.user?.pseudonym}
            src={'/' + message.user!.avatarUrl}
          />
        </ListItemAvatar>
        <ListItemText
          primary={`${message.user!.pseudonym}`}
          secondary={`${message.content}`}
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
  const theme: any = useTheme();

  useEffect(() => {
    store.setRef(ref);
  });
  const startReached = () => {
    void store.fetchMore();
  };
  return (
    <Virtuoso
      style={{
        flexGrow: 1,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        backgroundColor: theme.palette.grey[900],
      }}
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
