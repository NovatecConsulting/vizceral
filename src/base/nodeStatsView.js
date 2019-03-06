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

class NodeStatsView extends BaseView {
  constructor (nodeView, fixedWidth) {
    super(nodeView.object);
    this.fixedWidth = fixedWidth;
    this.nodeName = nodeView.object.getDisplayName();
    this.nodeView = nodeView;

    // How far away from the node we want the label to begin
    this.buffer = Math.max(this.nodeView.radius * 0.3, 7);

    // Create the canvas to build a sprite
    this.nameCanvas = this.createCanvas(200, this.fontSize * 3 + 10);

    this.nameTexture = new THREE.Texture(this.nameCanvas);
    this.nameTexture.minFilter = THREE.LinearFilter;

    this.updateLabel();

    this.material = new THREE.MeshBasicMaterial({ map: this.nameTexture, side: THREE.DoubleSide, transparent: true });
    this.view = this.addChildElement(new THREE.PlaneBufferGeometry(this.nameCanvas.width, this.nameCanvas.height), this.material);
  }

  updateLabel () {
    const textLines = [];
    let requestCount;
    let errorCount;
    let responseTime;

    if (this.object.metrics) {
      requestCount = _.defaultTo(this.object.metrics.requestCount, -1);
      errorCount = _.defaultTo(this.object.metrics.errorCount, -1);
      responseTime = _.defaultTo(this.object.metrics.responseTime, -1);
    }

    if (requestCount >= 0) {
      let requestCountTotal = requestCount;
      if (errorCount >= 0) {
        requestCountTotal += errorCount;
      }
      textLines.push(`Requests: ${requestCountTotal}`);
    }
    if (errorCount >= 0) {
      textLines.push(`Errors: ${errorCount}`);
    }
    if (responseTime >= 0) {
      textLines.push(`Avg. Resp. Time: ${Math.floor(responseTime)} ms`);
    }

    let showParent = false;

    if (_.has(this.object, 'metadata.componentMapping') && this.object.metadata.componentMapping.length > 0) {
      const meta = this.object.metadata;

      if (meta.aggregation === 'service') {
        textLines.splice(0, 0, meta.componentMapping[0].app);
        showParent = true;
      } else if (meta.aggregation === 'node') {
        textLines.splice(0, 0, `${meta.componentMapping[0].app}[${meta.componentMapping[0].service}]`);
        showParent = true;
      }
    }

    const context = this.nameCanvas.getContext('2d');
    const fontSize = 18;
    const spacing = fontSize / 4;

    const font = `${fontSize}px 'Source Sans Pro', sans-serif`;
    context.font = font;

    // Label Width
    const labelWidths = _.map(textLines, text => context.measureText(text).width);
    const maxWidth = _.max(labelWidths);

    // const labelWidth = context.measureText(text3).width;
    if (maxWidth !== this.labelWidth) { this.labelWidth = maxWidth; }
    this.resizeCanvas(this.nameCanvas, this.labelWidth, fontSize * textLines.length + spacing * (textLines.length - 1));

    _.each(textLines, (text, idx) => {
      context.fillStyle = GlobalStyles.styles.colorBackgroundDark;
      context.textAlign = 'left';
      context.fillRect(0, fontSize * idx + spacing * idx, labelWidths[idx], fontSize);

      if (idx === 0 && showParent) {
        context.fillStyle = GlobalStyles.styles.colorTraffic.warning;
      } else {
        context.fillStyle = GlobalStyles.styles.colorTraffic.normal;
      }

      // y = (offset because the font is centered) + (offset for each row) + (spacing)
      context.fillText(textLines[idx], 0, fontSize / 2 + fontSize * idx + spacing * idx);
    });

    this.nameTexture.needsUpdate = true;

    if (this.view) {
      this.applyPosition();
      this.view.scale.x = 1;
      this.view.geometry.width = this.nameCanvas.width;
      this.view.geometry.height = this.nameCanvas.height;
      this.view.geometry.needsUpdate = true;
    }
  }

  updatePosition () {
    // Update the bounding box
    this.boundingBox = {};
    // Add a little bit of fuzziness to the label height since we don't care if it overlaps a little...
    const yDelta = (this.nameCanvas.height * 0.6) / 2;
    this.boundingBox.top = this.nodeView.object.position.y - yDelta;
    this.boundingBox.bottom = this.nodeView.object.position.y + yDelta;
    if (this.nodeView.labelPositionLeft) {
      this.boundingBox.right = this.nodeView.object.boundingBox.left - this.buffer;
      this.boundingBox.left = this.boundingBox.right - this.nameCanvas.width;
    } else {
      this.boundingBox.left = this.nodeView.object.boundingBox.right + this.buffer;
      this.boundingBox.right = this.boundingBox.left + this.nameCanvas.width;
    }
  }

  applyPosition () {
    const spacing = 12;
    const x = this.nodeView.radius + (this.labelWidth / 2) + spacing;
    const y = 0;

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
    this.nameTexture.dispose();
    this.material.dispose();
  }
}

export default NodeStatsView;
