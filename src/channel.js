let _tabId = null,
  _registered = false,
  _msgFlag = "TcMsg_oo_",
  _channels = [];

function getRandomString(length) {
  let text = "",
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < (length || 5); i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function msgHandler(e) {
  const key = e.key;
  const newValue = e.newValue;
  let obj = null;

  if (key.indexOf(_msgFlag) > -1 && newValue) {
    try {
      obj = JSON.parse(newValue);
    } catch (e) {
      this.onmessageerror(e);
    }

    if (
      obj.tabId !== _tabId &&
      obj.channelId === this.channelId &&
      !this.closed
    ) {
      let msg =
        typeof obj.message === "string"
          ? obj.message
          : JSON.stringify(obj.message);
      this.onmessage({ data: msg });
      window.localStorage.removeItem(key);
    }
  }
}

class TabChannel {
  constructor(channelName) {
    if (!window.localStorage) {
      throw new Error("localStorage not available");
    }
    if (!channelName) {
      throw new Error("channel name required");
    }

    this.name = channelName;
    this.channelId = channelName;
    this.handler = msgHandler.bind(this);
    _tabId = _tabId || getRandomString();
    _channels.push(this.channelId);

    if (!_registered) {
      _registered = true;

      window.addEventListener("storage", this.handler, false);
    }
  }
  postMessage(msg) {
    if (this.closed) {
      this.onmessageerror(new Error("channel closed"));
      return;
    }

    const msgObj = {
      channelId: this.channelId,
      tabId: _tabId,
      message: typeof msg === "string" ? msg : JSON.stringify(msg)
    };
    const key = _msgFlag + getRandomString() + "_" + this.channelId;

    try {
      window.localStorage.setItem(key, JSON.stringify(msgObj));
    } catch (e) {
      this.onmessageerror(e);
    }

    setTimeout(function() {
      window.localStorage.removeItem(key);
    }, 1000);
  }
  close() {
    this.closed = true;
    let index = _channels.indexOf(this.channelId);

    if (index > -1) {
      _channels.splice(index, 1);
    }

    if (_channels.length === 0) {
      window.removeEventListener("storage", this.handler);
      _registered = false;
    }
  }
  onmessage() {
    // override by user
  }
  onmessageerror() {
    // override by user
  }
}

export default window.BroadcastChannel || TabChannel;
