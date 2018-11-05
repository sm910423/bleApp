import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';

@Component({
  selector: 'page-device',
  templateUrl: 'device.html',
})
export class DevicePage {
  HEARTRATESPEC: any = {
    service: '180d',//'180a'
    measurement: '2a37'
  };
  device;
  characteristics: any = [];
  connecting: boolean = false;
  historical_data: any;
  peripheralData: any = {};
  heartRateValue;

  constructor (
    public navCtrl: NavController, 
    public navParams: NavParams,
    public ble: BLE,
    private ngZone: NgZone
  ) {
    this.device = this.navParams.get("device");
    this.connecting = true;
    this.connect(this.device.id);
  }

  ionViewDidLoad() {
    
  }

  connect(deviceID) {
    this.characteristics = [];
    this.ble.connect(deviceID).subscribe(
      peripheralData => this.onConnected(peripheralData),
      peripheralData => this.onDisconnected(peripheralData)
    );
  }

  onConnected(peripheralData) {
      this.peripheralData = peripheralData;

      this.ble.startNotification(this.peripheralData.id, this.HEARTRATESPEC.service, this.HEARTRATESPEC.measurement).subscribe(
        buffer => {
          this.ngZone.run(() => {
            let data = new Uint8Array(buffer);
            this.heartRateValue = data[1];
          });
        }
      )
  }

  onDisconnected(peripheralData) {

  }

  ionViewWillLeave() {
    this.ble.disconnect(this.peripheralData.id);
  }
}
