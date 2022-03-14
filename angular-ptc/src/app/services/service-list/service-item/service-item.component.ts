import {Component, Input, OnInit} from '@angular/core';
import {ServiceModel} from '../../../models/service.model';

@Component({
  selector: 'app-service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.css']
})
export class ServiceItemComponent implements OnInit {

  @Input() item: ServiceModel;
  @Input() index: string;

  myMap = new Map<string, string>([
    ['BUS', 'https://media.istockphoto.com/vectors/bus-vector-vehicle-flat-silhouette-icon-city-transportation-symbol-vector-id1227543233?k=20&m=1227543233&s=612x612&w=0&h=jKDCsTgJyzXP5x2X_hGul__rsSj0qr-NM6gINp2EbCA='],
    ['TRAM', 'https://media.istockphoto.com/vectors/tram-vector-id538040408?k=20&m=538040408&s=612x612&w=0&h=bRc5-CR1uFvvBUd7CGUl3D0SCgLcSqtmtAkZCgqy9F8='],
    ['SUBWAY', 'https://media.istockphoto.com/vectors/rail-vector-id1206372699?k=20&m=1206372699&s=612x612&w=0&h=C2BhPZqJdf6EX_lzzL6CJsV6uAXgtjjfYOObd1GiXYo='],
    ['BOAT', 'https://media.istockphoto.com/vectors/ship-cargo-icon-vector-design-template-vector-id1257202110?k=20&m=1257202110&s=612x612&w=0&h=X06-zGOHLfyVUvAVU6bo52P-m-oHAGBLdCDSCrzGzAk=']
  ]);

  constructor() { }

  ngOnInit() {
  }

}
