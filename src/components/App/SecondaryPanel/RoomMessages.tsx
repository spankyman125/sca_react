import EditIcon from '@mui/icons-material/Edit';
import {
  Avatar,
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ListItemAvatar,
  Typography,
  useTheme,
} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useRef, useState } from 'react';
import { GroupedVirtuoso, GroupedVirtuosoHandle } from 'react-virtuoso';
import { Message } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import { authStore } from '../../../stores/AuthStore';
import { userInfoPanelUI } from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';
import RoomMessagesUI from '../../../stores/ui/App/RoomPanel/RoomMessagesUI';

const MessageRow = observer(
  ({ message, store }: { message: Message; store: RoomMessagesUI }) => {
    const [hovered, setHovered] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLSpanElement>(null);

    return (
      <ListItem
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        component="div"
        disablePadding
        secondaryAction={
          hovered &&
          message.userId == authStore.user?.id && (
            <IconButton
              size="small"
              onClick={() => {
                setIsEditing(true);
                setTimeout(function () {
                  inputRef.current?.focus();
                }, 0);
              }}
            >
              <EditIcon />
            </IconButton>
          )
        }
      >
        <ListItemButton alignItems="flex-start">
          <ListItemAvatar
            onClick={() => void userInfoPanelUI.open(message.userId)}
          >
            <Avatar
              alt={message.user?.pseudonym}
              src={STATIC_URL + (message.user?.avatarUrl || '')}
              sx={{ ':hover': { outline: 'solid white' } }}
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
                  {` ${
                    new Date(message.createdAt).toTimeString().split(' ')[0]
                  } #${message.id}`}
                </Typography>
              </Typography>
            }
            secondary={
              <Typography
                variant="body2"
                color={'text.secondary'}
                sx={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                ref={inputRef}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.code === 'Enter') {
                    if (!e.shiftKey) {
                      setIsEditing(false);
                      setTimeout(() => {
                        inputRef.current?.blur();
                      }, 0);
                      store.editMessage(
                        message.id,
                        inputRef.current?.textContent
                          ? inputRef.current?.textContent
                          : message.content,
                      );
                    }
                  }
                }}
              >
                {message.content}
                {message.attachments && (
                  <ImageList sx={{ maxWidth: 600 }} cols={3}>
                    {message.attachments.map((attachment) => (
                      <ImageListItem key={attachment.id}>
                        <img src={STATIC_URL + attachment.url} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Typography>
            }
            disableTypography
          />
        </ListItemButton>
      </ListItem>
    );
  },
);

const RoomMessages = observer(({ store }: { store: RoomMessagesUI }) => {
  const theme = useTheme();
  const itemContent = useCallback(
    (i: number) => (
      <MessageRow
        message={store.messages[i - store.firstItemIndex]}
        store={store}
      />
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
