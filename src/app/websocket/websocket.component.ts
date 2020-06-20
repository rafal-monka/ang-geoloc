import { Component, OnInit } from '@angular/core';
import { Utils } from '../utils';
import { Data } from '../data-service';

@Component({
  selector: 'app-websocket',
  templateUrl: './websocket.component.html',
  styleUrls: ['./websocket.component.css'],
  providers: [ Utils ]
})
export class WebsocketComponent implements OnInit {

  hashkey: string
  messages: Array<any> = []
  text: string
  imei: string
  socket: WebSocket
  lifeDataState: boolean

  constructor(
      private utils: Utils,
      public data: Data
  ) { }

  ngOnInit() {
    if (this.data.storage) {
      this.imei = this.data.storage.imei
    }
  }

  toggleLiveData() {
      console.log('toggleLiveData', this.lifeDataState)
      if (this.lifeDataState) {
          console.log('offLiveData, socket.close()')
          this.socket.close(1000, this.hashkey)
      } else {
          this.socket = new WebSocket(this.utils.httpToWs()+"?imei="+this.imei); /*###IMEI*/
          this.turnOn(
              () => {
                this.messages.push('[CLIENT] callbackOnOpen')
                this.lifeDataState = true
              },
              (msg) => {
                  console.log('callback:', msg)
                  this.messages.push(msg)
              },
              () => {
                this.messages.push('[CLIENT] callbackOnClose')
                this.lifeDataState = false
              }
          )
      }

      console.log('toggleLiveData', this.lifeDataState)
  }


  sendText() {
      this.socket.send(this.text)
  }

  private turnOn(callbackOnOpen, callbackOnMessage, callbackOnClose) {

      this.socket.onopen = function(e) {
// console.log("[client] [on-open] Sending to server");
          callbackOnOpen()
      };

      this.socket.onmessage = function (event) {
// console.log(`[client] [on-message] received from server: ${event.data}`);
          callbackOnMessage(event.data)
      }

      this.socket.onclose = function(event) {
          callbackOnClose()
          if (event.wasClean) {
              console.log(`[client]  Connection closed cleanly, code=${event.code} reason=${event.reason}`);
          } else {
              // e.g. server process killed or network down
              // event.code is usually 1006 in this case
              console.log('[close] Connection died');
          }
      };

      this.socket.onerror = function(error) {
          console.log('[error]', JSON.stringify(error));
      };
  }

}
