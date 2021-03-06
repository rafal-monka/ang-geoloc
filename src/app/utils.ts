import { Injectable } from '@angular/core';

@Injectable()
export class Utils {
  RGBToHex(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;

    return "#" + r + g + b;
  }

  getSpeedColor(speed) {
    var color;// = GeolocApp.GUI_POLYLINE_COLOR;
    //speed in km/h
    if (speed === 0) {
      color = this.RGBToHex(200, 200, 200);
    } else if (speed < 3) {
      color = this.RGBToHex(204, 255, 204);
    } else if (speed < 10) {
      color = this.RGBToHex(102, 255, 102);
    } else if (speed < 30) {
      color = this.RGBToHex(255, 255, 153);
    } else if (speed < 50) {
      color = this.RGBToHex(255, 255, 0);
    } else if (speed < 70) {
      color = this.RGBToHex(255, 204, 128);
    } else if (speed < 90) {
      color = this.RGBToHex(255, 163, 26);
    } else if (speed < 100) {
      color = this.RGBToHex(255, 179, 179);
    } else if (speed < 120) {
      color = this.RGBToHex(255, 77, 77);
    } else if (speed < 140) {
      color = this.RGBToHex(255, 26, 26);
    } else if (speed < 160) {
      color = this.RGBToHex(152, 152, 230);
    } else if (speed < 200) {
      color = this.RGBToHex(70, 70, 210);
    } else if (speed < 250) {
      color = this.RGBToHex(40, 40, 164);
    } else if (speed < 1500) {
      color = this.RGBToHex(179, 0, 179);
    } else if (speed < 10000) {
        color = this.RGBToHex(0,0,0);
    };
    return color;
  }

  //#https://realtimelogic.com/articles/Creating-SinglePage-Apps-with-the-Minnow-Server
  httpToWs() {
      const l = window.location;
      let wsURL = '';
      // Start by working out if the calling URL was secure or not.
      if (l.protocol === 'https:') {
          wsURL = wsURL.concat('wss://');
      } else {
          wsURL = wsURL.concat('ws://');
      }
      // Concatenate the hostname onto the URL.
      wsURL = wsURL.concat(l.hostname);
      // Now process any non-standard port numbers.
      if  (l.port !== "80" && l.port !== "443" && l.port.length !== 0) {
          let port = (l.port === "4200") ? "8080" : l.port
          wsURL = wsURL.concat(':' + port);
      }
      // Now add in anything left in the way of a path part of the URL.
      wsURL = wsURL.concat(l.pathname);
      // Return the WebSocket URL we have created.
      return(wsURL);
  };
}
