import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import _ from 'lodash';

cytoscape.use(coseBilkent);

class CytoscapeLayout {
  run (graph, dimensions, layoutComplete) {
    const nodes = _.map(graph.nodes, n => ({
      data: {
        id: n.name,
        node: n
      }
    }));

    const connections = _.map(graph.connections, c => ({
      data: {
        id: c.name,
        source: c.source.name,
        target: c.target.name
      }
    }));

    const elements = _.concat(nodes, connections);

    const cy = cytoscape({
      headless: true,

      elements: elements
    });

    let options = {
      name: 'cose',

      // Called on `layoutready`
      ready: function () {
        _.each(this.cy().nodes(), (n) => {
          const originNode = n.data().node;
          originNode.updatePosition({
            x: n.position().x, //* 25 * 5 - 500,
            y: n.position().y //* 25 * 5 - 500
          });

          layoutComplete();
        });
      },

      // Called on `layoutstop`
      stop: function () {},

      // Whether to animate while running the layout
      // true : Animate continuously as the layout is running
      // false : Just show the end result
      // 'end' : Animate with the end result, from the initial positions to the end positions
      animate: true,

      // Easing of the animation for animate:'end'
      animationEasing: undefined,

      // The duration of the animation for animate:'end'
      animationDuration: undefined,

      // A function that determines whether the node should be animated
      // All nodes animated by default on animate enabled
      // Non-animated nodes are positioned immediately when the layout starts
      animateFilter: () => false,


      // The layout animates only after this many milliseconds for animate:true
      // (prevents flashing on fast runs)
      animationThreshold: 250,

      // Number of iterations between consecutive screen positions update
      refresh: 20,

      // Whether to fit the network view after when done
      fit: true,

      // Padding on fit
      padding: 100,

      // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      boundingBox: undefined, /* {
          x1: -2000, y1: -2000, w:4000, h:4000
        }, */

      // Excludes the label when calculating node bounding boxes for the layout algorithm
      nodeDimensionsIncludeLabels: false,

      // Randomize the initial positions of the nodes (true) or use existing positions (false)
      randomize: false,

      // Extra spacing between components in non-compound graphs
      componentSpacing: 400,

      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: () => 2048,

      // Node repulsion (overlapping) multiplier
      nodeOverlap: 4,

      // Ideal edge (non nested) length
      idealEdgeLength: () => 32,

      // Divisor to compute edge forces
      edgeElasticity: () => 32,

      // Nesting factor (multiplier) to compute ideal edge length for nested edges
      nestingFactor: 1.2,

      // Gravity force (constant)
      gravity: 1,

      // Maximum number of iterations to perform
      numIter: 1000,

      // Initial temperature (maximum node displacement)
      initialTemp: 2000,

      // Cooling factor (how the temperature is reduced between consecutive iterations
      coolingFactor: 0.99,

      // Lower temperature threshold (below this point the layout will end)
      minTemp: 1.0,

      // Pass a reference to weaver to use threads for calculations
      weaver: false
    };

    options = {
      name: 'cose-bilkent',
      // Called on `layoutready`
      ready: function () {
        _.each(this.cy.nodes(), (n) => {
          const originNode = n.data().node;
          originNode.updatePosition({
            x: n.position().x * 8, // * 5 - 500,
            y: n.position().y * 8 // * 5 - 500
          });

          layoutComplete();
        });
      },
      // Called on `layoutstop`
      stop: function () {
      },
      // Whether to include labels in node dimensions. Useful for avoiding label overlap
      nodeDimensionsIncludeLabels: false,
      // number of ticks per frame; higher is faster but more jerky
      refresh: 30,
      // Whether to fit the network view after when done
      fit: true,
      // Padding on fit
      padding: 10,
      // Whether to enable incremental mode
      randomize: true,
      // Node repulsion (non overlapping) multiplier
      nodeRepulsion: 9000,
      // Ideal (intra-graph) edge length
      idealEdgeLength: 50,
      // Divisor to compute edge forces
      edgeElasticity: 0.45,
      // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
      nestingFactor: 0.1,
      // Gravity force (constant)
      gravity: 0.25,
      // Maximum number of iterations to perform
      numIter: 2500,
      // Whether to tile disconnected nodes
      tile: true,
      // Type of layout animation. The option set is {'during', 'end', false}
      animate: false,
      // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
      tilingPaddingVertical: 10,
      // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
      tilingPaddingHorizontal: 10,
      // Gravity range (constant) for compounds
      gravityRangeCompound: 1.5,
      // Gravity force (constant) for compounds
      gravityCompound: 1.0,
      // Gravity range (constant)
      gravityRange: 3.8,
      // Initial cooling factor for incremental layout
      initialEnergyOnIncremental: 0.5
    };

    const layout = cy.layout(options);

    layout.run();
    // console.log(layout);

    // _.each(cy.nodes(), n => {
    //   let originNode = n.data().node;
    //   originNode.updatePosition({
    //     x: n.position().x * 25 * 5 - 500,
    //     y: n.position().y * 25 * 5 - 500
    //   });
    // });

    // for (let i = 0; i < nodes.length; i++) {
    //   const node = nodes[i];
    //   const metadataPosition = node.metadata && node.metadata.position;
    //   let fixedPos;
    //   if (metadataPosition) {
    //     const posX = metadataPosition.x;
    //     const posY = metadataPosition.y;
    //     if (typeof posX === 'number' && Number.isFinite(posX) && typeof posY === 'number' && Number.isFinite(posY)) {
    //       fixedPos = { x: posX, y: posY };
    //     }
    //   }
    //   let pos = fixedPos;
    //   if (!fixedPos) {
    //     pos = {
    //       x: Math.cos(i * angleBetweenNodes) * hw,
    //       y: Math.sin(i * angleBetweenNodes) * hh
    //     };
    //   }

    //   console.log(node, " <-> ", pos);


    //   node.updatePosition(pos);
    // }
    // layoutComplete();
  }
}

export default CytoscapeLayout;
