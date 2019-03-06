/**
 *
 *  Copyright 2016 Netflix, Inc.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License");
 *     you may not use this file except in compliance with the License.
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS,
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 *
 */
import * as THREE from 'three';

import _ from 'lodash';
import BaseView from './baseView';
import GlobalStyles from '../globalStyles';

let warningNoticeImages;

function generateNoticeSVGs () {
  if (!warningNoticeImages) {
    warningNoticeImages = [
      new Image(),
      new Image(),
      new Image()
    ];

    const noticeIconSVG = [
      `
      <svg xmlns="http://www.w3.org/2000/svg" height="140" width="140" viewBox="0 0 1000 1026">
        <path d="M125.1,899.6c0,0-96-58.5-84-148.5s408-648,408-648l138,9l364.5,621l10.5,148.5l-138,33L125.1,899.6z" fill="${GlobalStyles.styles.colorPageBackground}"/>
        <path d="M513.71 149.5q-48.75 0 -81.25 55l-307.5 512.5q-32.5 55 -10.625 95t86.875 40l625 0q65 0 86.25 -40t-11.25 -95l-307.5 -512.5q-32.5 -55 -80 -55zm0 -105q106.25 0 168.75 106.25l308.75 513.75q62.5 105 11.25 198.75 -51.25 92.5 -176.25 92.5l-625 0q-123.75 0 -177.5 -92.5 -52.5 -92.5 11.25 -198.75l308.75 -513.75q62.5 -106.25 170 -106.25zm-68.75 651.25q0 -68.75 68.75 -68.75 67.5 0 67.5 68.75 0 67.5 -67.5 67.5 -68.75 0 -68.75 -67.5zm146.25 -312.5q0 13.75 -6.25 28.75l-71.25 178.75q-43.75 -107.5 -72.5 -178.75 -6.25 -15 -6.25 -28.75 0 -32.5 23.125 -55.625t55.625 -23.125 55 23.125 22.5 55.625z" fill="${GlobalStyles.styles.colorTraffic.normal}"/>
      </svg>
      `,
      `
      <svg xmlns="http://www.w3.org/2000/svg" height="140" width="140" viewBox="0 0 1000 1026">
        <path d="M125.1,899.6c0,0-96-58.5-84-148.5s408-648,408-648l138,9l364.5,621l10.5,148.5l-138,33L125.1,899.6z" fill="${GlobalStyles.styles.colorPageBackground}"/>
        <path d="M513.71 149.5q-48.75 0 -81.25 55l-307.5 512.5q-32.5 55 -10.625 95t86.875 40l625 0q65 0 86.25 -40t-11.25 -95l-307.5 -512.5q-32.5 -55 -80 -55zm0 -105q106.25 0 168.75 106.25l308.75 513.75q62.5 105 11.25 198.75 -51.25 92.5 -176.25 92.5l-625 0q-123.75 0 -177.5 -92.5 -52.5 -92.5 11.25 -198.75l308.75 -513.75q62.5 -106.25 170 -106.25zm-68.75 651.25q0 -68.75 68.75 -68.75 67.5 0 67.5 68.75 0 67.5 -67.5 67.5 -68.75 0 -68.75 -67.5zm146.25 -312.5q0 13.75 -6.25 28.75l-71.25 178.75q-43.75 -107.5 -72.5 -178.75 -6.25 -15 -6.25 -28.75 0 -32.5 23.125 -55.625t55.625 -23.125 55 23.125 22.5 55.625z" fill="${GlobalStyles.styles.colorTraffic.warning}"/>
      </svg>
      `,
      `
      <svg xmlns="http://www.w3.org/2000/svg" height="140" width="140" viewBox="0 0 1000 1026">
        <path d="M125.1,899.6c0,0-96-58.5-84-148.5s408-648,408-648l138,9l364.5,621l10.5,148.5l-138,33L125.1,899.6z" fill="${GlobalStyles.styles.colorPageBackground}"/>
        <path d="M513.71 149.5q-48.75 0 -81.25 55l-307.5 512.5q-32.5 55 -10.625 95t86.875 40l625 0q65 0 86.25 -40t-11.25 -95l-307.5 -512.5q-32.5 -55 -80 -55zm0 -105q106.25 0 168.75 106.25l308.75 513.75q62.5 105 11.25 198.75 -51.25 92.5 -176.25 92.5l-625 0q-123.75 0 -177.5 -92.5 -52.5 -92.5 11.25 -198.75l308.75 -513.75q62.5 -106.25 170 -106.25zm-68.75 651.25q0 -68.75 68.75 -68.75 67.5 0 67.5 68.75 0 67.5 -67.5 67.5 -68.75 0 -68.75 -67.5zm146.25 -312.5q0 13.75 -6.25 28.75l-71.25 178.75q-43.75 -107.5 -72.5 -178.75 -6.25 -15 -6.25 -28.75 0 -32.5 23.125 -55.625t55.625 -23.125 55 23.125 22.5 55.625z" fill="${GlobalStyles.styles.colorTraffic.danger}"/>
      </svg>
      `
    ];

    _.each(warningNoticeImages, (image, i) => {
      image.src = `data:image/svg+xml;charset-utf-8,${encodeURIComponent(noticeIconSVG[i])}`;
    });
  }
}

class ConnectionStatsView extends BaseView {
  constructor (connectionView) {
    generateNoticeSVGs(); // Do this at first construct so we can use the passed in colors for the notices
    super(connectionView.object);
    this.connectionView = connectionView;

    this.severity = 1;

    // Create the canvas to build a sprite
    this.noticeCanvas = this.createCanvas(200, 200);
    this.noticeTexture = new THREE.Texture(this.noticeCanvas);
    this.noticeTexture.minFilter = THREE.LinearFilter;

    this.updateNoticeIcon();

    this.material = new THREE.MeshBasicMaterial({ map: this.noticeTexture, side: THREE.DoubleSide, transparent: true });
    this.addChildElement(new THREE.PlaneBufferGeometry(this.noticeCanvas.width, this.noticeCanvas.height), this.material);

    this.updatePosition();
  }

  updateNoticeIcon () {
    //   debugger;
    const requestCount = _.defaultTo(this.object.volume.normal, -1) + _.defaultTo(this.object.volume.danger, 0);
    const connectionTime = Math.floor(_.defaultTo(this.object.metadata.connectionTime, -1));
    const errors = _.defaultTo(this.object.volume.danger, -1);
    const textParts = [];

    if (connectionTime >= 0) {
      textParts.push(`${connectionTime} ms`);
    }
    if (requestCount >= 0) {
      textParts.push(`${requestCount} Reqeusts`);
    }
    if (errors >= 0) {
      textParts.push(`${errors} Errors`);
    }

    const statsText = _.join(textParts, ', ');

    const context = this.noticeCanvas.getContext('2d');
    context.scale(2, 2);
    const fontSize = 18;

    const font = `${fontSize}px 'Source Sans Pro', sans-serif`;
    context.font = font;

    this.defaultLabelWidth = context.measureText(statsText).width + 16;
    const labelWidth = context.measureText(statsText).width + 16;
    if (labelWidth !== this.labelWidth) {
      this.labelWidth = labelWidth;
    }
    this.resizeCanvas(this.noticeCanvas, this.labelWidth, fontSize + 10);

    //

    context.clearRect(0, 0, this.noticeCanvas.width, this.noticeCanvas.height);

    context.fillStyle = GlobalStyles.styles.colorBackgroundDark;
    context.fillStyle = GlobalStyles.styles.colorTraffic.normal;
    context.fillRect(0, 0, this.noticeCanvas.width, this.noticeCanvas.height);

    context.textAlign = 'center';
    context.fillStyle = GlobalStyles.styles.colorLabelText;
    context.fillText(statsText, this.noticeCanvas.width / 2, this.noticeCanvas.height / 2);

    this.noticeTexture.needsUpdate = true;
  }

  updatePosition () {
    const { x, y } = this.connectionView.centerVector;
    this.container.position.set(x, y, 1);
  }

  setHighlight (highlight) {
    this.highlight = highlight;
  }

  refresh () {
    this.updateLabel();
  }

  setOpacity (opacity) {
    super.setOpacity(opacity);
    this.material.opacity = opacity;
  }

  cleanup () {
    this.noticeTexture.dispose();
    this.material.dispose();
  }
}

export default ConnectionStatsView;
