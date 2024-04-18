class Tree {
   constructor(center, size = 80, height = 120) { // Adjusted for wider base and moderate height
      this.center = center;
      this.size = size; // size of the base
      this.height = height;
      this.base = this.#generateLevel(center, size);
   }

   #generateLevel(point, size) {
      const points = [];
      const rad = size / 2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 16) {
         const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17) ** 2;
         const noisyRadius = rad * lerp(0.8, 1.2, kindOfRandom); // Increase variation for a more organic look
         points.push(translate(point, a, noisyRadius));
      }
      return new Polygon(points);
   }

   draw(ctx, viewPoint) {
      const top = getFake3dPoint(this.center, viewPoint, this.height);

      const levelCount = 10; // Increased level count for denser foliage
      for (let level = 0; level < levelCount; level++) {
         const t = level / (levelCount - 1);
         const point = lerp2D(this.center, top, t);
         const color = `rgb(30, ${Math.floor(lerp(60, 180, t))}, 30)`;
         const size = lerp(this.size, this.size * 0.2, Math.sqrt(t)); // Wider at the base and tapering slightly
         const poly = this.#generateLevel(point, size);
         poly.draw(ctx, { fill: color, stroke: "rgba(0,0,0,0)" });
      }
   }
}

function translate(point, angle, radius) {
   return {
       x: point.x + radius * Math.cos(angle),
       y: point.y + radius * Math.sin(angle)
   };
}

function lerp(start, end, t) {
   return start + (end - start) * t;
}

function lerp2D(point1, point2, t) {
   return {
       x: lerp(point1.x, point2.x, t),
       y: lerp(point1.y, point2.y, t)
   };
}

function getFake3dPoint(point, viewPoint, offsetZ) {
   return {
       x: point.x + (viewPoint.x - point.x) * 0.1,
       y: point.y + (viewPoint.y - point.y) * 0.1,
       z: offsetZ
   };
}
