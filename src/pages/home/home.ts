import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { DevicePage } from '../device/device';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  HEARTRATESPEC: any = {
    service: '180d',//'180a'
    measurement: '2a37'
  };
  devices: any = [];
  isScanning: boolean = false;
    
  constructor (
    public navCtrl: NavController,
    public ble: BLE
  ) {
    
  }
  
  startScanning() {
    this.devices = [];
    this.isScanning = true;
    this.ble.startScan([this.HEARTRATESPEC.service]).subscribe((device) => {
      this.devices.push(device);
    }, (err) => {
      this.isScanning = false;
    });
    setTimeout(() => {
      this.ble.stopScan().then(() => {
        this.isScanning = false;
      });
    }, 10000);
  }

  connectToDevice(device) {
    this.navCtrl.push(DevicePage, { device: device });
  }
  
}
  