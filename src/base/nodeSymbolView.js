import * as THREE from 'three';

import _ from 'lodash';
import NodeView from './nodeView';
import NodeNameView from './nodeNameView';

const radius = 40;
const padding = 16;

const symbols = {};

class NodeViewStandard extends NodeView {
  constructor (service) {
    super(service);
    this.radius = radius;

    if (!_.has(symbols, service.symbol)) {
      symbols[service.symbol] = new THREE.TextureLoader().load(service.symbol);
    }

    // Background Circle
    this.backgroundColor = new THREE.Color('rgb(33,33,36)'); // GlobalStyles.rgba.colorBackgroundDark;
    this.backgroundCircleMaterial = new THREE.MeshBasicMaterial({ color: this.backgroundColor, transparent: true });
    this.meshes.backgroundCircle = this.addChildElement(this.getBackgroundCircle(), this.backgroundCircleMaterial);

    // Symbol
    this.symbolColor = new THREE.Color('rgb(192, 213, 217)');
    // this.symbolHighlightColor = new THREE.Color('rgb(87, 228, 255)');
    this.symbolMaterial = new THREE.MeshBasicMaterial({ map: symbols[service.symbol], side: THREE.DoubleSide, transparent: true });
    this.meshes.symbol = this.addChildElement(new THREE.PlaneBufferGeometry((radius - padding) * 2, (radius - padding) * 2), this.symbolMaterial);

    // Outline
    this.outlineMaterial = new THREE.MeshBasicMaterial({ color: this.symbolColor, transparent: true });
    this.meshes.outline = this.addChildElement(this.getOutlineCircle(), this.outlineMaterial);

    // Add the service name
    if (!_.has(service, 'hideName') || !service.hideName) {
      this.nameView = new NodeNameView(this, false);
      this.showLabel(this.object.options.showLabel);
    }
  }

  isInteractive () {
    return true;
  }

  getBackgroundCircle () {
    const circleShape = new THREE.Shape();
    circleShape.moveTo(radius, 0);
    circleShape.absarc(0, 0, radius, 0, 2 * Math.PI, false);
    return new THREE.ShapeGeometry(circleShape, radius);
  }

  getOutlineCircle () {
    const border = new THREE.Shape();
    border.absarc(0, 0, radius + 2, 0, Math.PI * 2, false);
    const borderHole = new THREE.Path();
    borderHole.absarc(0, 0, radius, 0, Math.PI * 2, true);
    border.holes.push(borderHole);
    return new THREE.ShapeGeometry(border, radius);
  }

  setOpacity (opacity) {
    super.setOpacity(opacity);

    this.backgroundCircleMaterial.opacity = opacity;
    this.symbolMaterial.opacity = opacity;
    this.outlineMaterial.opacity = opacity;
  }

  refresh () {
    this.object.classInvalidated = false;

    super.refreshFocused();

    if (this.highlight) {
      this.backgroundCircleMaterial.color.set(this.symbolColor);
      this.symbolMaterial.color.set(this.backgroundColor);
    } else {
      this.backgroundCircleMaterial.color.set(this.backgroundColor);
      this.symbolMaterial.color.set(this.symbolColor);
    }

    this.meshes.backgroundCircle.geometry.colorsNeedUpdate = true;
    this.meshes.symbol.geometry.colorsNeedUpdate = true;
  }
}

export default NodeViewStandard;
