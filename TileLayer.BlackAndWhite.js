/*
 * L.TileLayer.BlackAndWhite is a regular tilelayer with black and white makeover.
 * Adapted from https://github.com/Zverik/leaflet-grayscale
 */

L.TileLayer.BlackAndWhite = L.TileLayer.extend({
    options: {
        whiteThreshold: 210 // colors avarages bigger than the threshold are converted to white
    },

    initialize: function (url, options) {
        options.crossOrigin = true;
        L.TileLayer.prototype.initialize.call(this, url, options);

        this.on('tileloadstart', function(e) {
            if (e.tile.getAttribute('data-grayscaled'))
                return
            e.tile.classList.add('leaflet-tile-invisible');
        });

        this.on('tileload', function(e) {
            this._makeGrayscale(e.tile);
        });
    },

    _createTile: function () {
        var tile = L.TileLayer.prototype._createTile.call(this);
        tile.crossOrigin = "Anonymous";
        return tile;
    },

    _makeGrayscale: function (img) {
        if (img.getAttribute('data-grayscaled'))
            return;

        img.crossOrigin = '';
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // one-dimensional array containing the data in the RGBA order, with integer values between 0 and 255 (included)
        var pix = imgd.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            var color = Math.max(pix[i], pix[i+1], pix[i+2]);
            var grayColor = 0;
            if (color > this.options.whiteThreshold) {
                grayColor = 255;
            }
            pix[i] = pix[i + 1] = pix[i + 2] = grayColor;
        }
        ctx.putImageData(imgd, 0, 0);
        img.setAttribute('data-grayscaled', true);
        img.src = canvas.toDataURL();
        img.addEventListener('load', function(e) {
            e.target.classList.remove('leaflet-tile-invisible');
            console.log(e.target.classList);
        });
    }
});

L.tileLayer.blackAndWhite = function (url, options) {
    return new L.TileLayer.BlackAndWhite(url, options);
};
