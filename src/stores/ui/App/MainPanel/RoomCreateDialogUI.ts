import { makeAutoObservable, runInAction } from 'mobx';
import MainBarUI from './MainBarUI';
import RoomsAPI from '../../../../api/http/Rooms';
import { STATIC_URL } from '../../../../consts';

export default class RoomCreateDialogUI {
  mainBarUI: MainBarUI;
  open = false;
  name = '';
  image: File | undefined = undefined;

  get imageURL() {
    return this.image
      ? URL.createObjectURL(this.image)
      : STATIC_URL + 'static/images/rooms/avatars/default.png';
  }

  constructor(mainBarUI: MainBarUI) {
    makeAutoObservable(this);
    this.mainBarUI = mainBarUI;
  }

  setOpen(open: boolean) {
    this.open = open;
  }

  setName(name: string) {
    this.name = name;
  }

  async createRoom() {
    const room = await RoomsAPI.create(this.name, this.image);
    runInAction(() => {
      this.mainBarUI.mainPanelUI.appUI.addRoom({
        ...room,
        messages: [],
        users: [],
      });
      this.open = false;
    });
  }

  setImage(image?: File) {
    if (image) this.image = image;
  }
}
