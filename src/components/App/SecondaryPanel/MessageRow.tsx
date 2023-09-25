import EditIcon from '@mui/icons-material/Edit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import {
  Avatar,
  IconButton,
  ImageList,
  ImageListItem,
  ListItemAvatar,
  Typography,
} from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import MessagesAPI from '../../../api/http/Messages';
import { Attachment, Message } from '../../../api/http/interfaces';
import { STATIC_URL } from '../../../consts';
import { authStore } from '../../../stores/AuthStore';
import { userInfoPanelUI } from '../../../stores/ui/App/MainPanel/UserInfoPanelUI';

export const MessageRow = observer(({ message }: { message: Message }) => {
  const [hovered, setHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ListItem
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      component="div"
      disablePadding
      secondaryAction={
        hovered &&
        message.userId == authStore.user?.id && (
          <IconButton size="small" onClick={() => setIsEditing(true)}>
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
          primary={<MessageHeader message={message} />}
          secondary={
            <>
              <MessageText
                isEditing={isEditing}
                message={message}
                setIsEditing={setIsEditing}
              />
              {message.attachments && (
                <MessageAttachments attachments={message.attachments} />
              )}
            </>
          }
          disableTypography
        />
      </ListItemButton>
    </ListItem>
  );
});

const MessageHeader = observer(({ message }: { message: Message }) => {
  return (
    <Typography>
      {message.user?.pseudonym}
      <Typography component={'span'} variant="caption" color={'GrayText'}>
        {` ${new Date(message.createdAt).toTimeString().split(' ')[0]} #${
          message.id
        }`}
      </Typography>
    </Typography>
  );
});

const MessageText = observer(
  ({
    isEditing,
    setIsEditing,
    message,
  }: {
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    message: Message;
  }) => {
    const inputRef = useRef<HTMLSpanElement>(null);
    if (isEditing)
      setTimeout(function () {
        inputRef.current?.focus();
      }, 0);
    return (
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
              if (inputRef.current?.innerText)
                void MessagesAPI.update(
                  message.id,
                  inputRef.current?.innerText,
                );
            }
          }
        }}
      >
        {message.content}
      </Typography>
    );
  },
);

const MessageAttachments = observer(
  ({ attachments }: { attachments: Attachment[] }) => {
    const [hoveredIndex, setHoveredIndex] = useState(-1);

    return (
      <ImageList sx={{ maxWidth: 600 }} cols={3}>
        <PhotoProvider>
          {attachments.map((attachment, i) => (
            <PhotoView src={STATIC_URL + attachment.url}>
              <ImageListItem
                key={attachment.id}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(-1)}
              >
                <img src={STATIC_URL + attachment.url} />
                {hoveredIndex === i && (
                  <ZoomInIcon
                    sx={{ position: 'absolute', right: 5, bottom: 5 }}
                  />
                )}
              </ImageListItem>
            </PhotoView>
          ))}
        </PhotoProvider>
      </ImageList>
    );
  },
);
