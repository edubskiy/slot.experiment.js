/**
 * Main Drawer
 * User: edubskiy
 * Date: 4/2/12
 * Time: 9:22 PM
 */

var Drawer = {

    xslDoc: false,

    dimensions: [],

    options: {
        widths: {
            data: null, // dynamically calculated
            info: 80,
            slotRowWidth: 50
        },
        slot: {
            color: 'blue',
            height: 50,
            width: 10
        },
        sections: {
            dimension: '.dimension',
            experiment: '.experiment',
            dimensionData: '.dimension-data',
            dimensionInfo: '.dimension-info',
            dimensionSlotRow: '.dimemsion-slots-row'
        },
        slots: {
            step: 5
        }
    },

    /**
     * Init xsl document and options
     * @param xslDoc
     * @param options
     */
    Init: function( xslDoc, options ) {

        if (typeof(xslDoc) === 'undefined')
        {
            alert("You should pass XSL Rendered Document");
            return false;
        }

        var self = this;

        this.xslDoc = xslDoc;
        this.options = $.extend({}, this.options, options);

        var $info = $(self.options.sections.dimensionInfo);
        var $data = $(self.options.sections.dimensionData);

        self.options.widths.data = $(document).width() - self.options.widths.info - 15;

        $info.width(self.options.widths.info);
        $data.width(self.options.widths.data);

        this.dimensions = $.map($(self.options.sections.dimension), function(elem, i) {
            return {
                totalSlots: $(elem).data('total-slots'),
                id: $(elem).attr('id'),
                experiments: $.map($(elem).find(self.options.sections.experiment), function(elem, i) {
                    return {
                        slots: $(elem).data('slots'),
                        id: $(elem).attr('id')
                    }
                })

            };
        });
    },

    /**
     * Start Point to begin Drawing!
     */
    Draw: function() {

        var self = this;

        $.each(self.dimensions, function(index, dimension) {

            // Drawing Dimension Canvas
            var $dimensionData = $('#'+dimension.id).find(self.options.sections.dimensionData);

            var canvasId = dimension.id+'-canvas';

            $('<canvas></canvas>')
                .attr('id', canvasId)
                .addClass('dimension-canvas')
                .appendTo($dimensionData);

            dimension.canvas = document.getElementById(canvasId);
            dimension.canvas.width  = self.options.widths.data;
            dimension.canvas.height = 20;

            var step = self.DrawSlotRow(dimension);

            $.each(dimension.experiments, function(index, experiment) {
                self.DrawExperiment(dimension,  experiment, step);
            })

        });
    },

    DrawSlotRow: function(dimension) {

        var totalSlots  = dimension.totalSlots,
            dimensionId = dimension.id,
            $dimensionData = $('#'+dimensionId),
            widthAvailable = this.options.widths.data,
            widthSlotRowStep = this.options.widths.slotRowWidth,
            widthRequired = widthSlotRowStep * totalSlots,
            elemsOnScreen = widthAvailable / widthSlotRowStep;

        var step = this.options.slots.step;

        if (step > totalSlots) {
            step = 1;
        }

        // Now check if we need increase step to fit the screen
        if (widthRequired > widthAvailable)
        {
            step = Math.round(totalSlots / elemsOnScreen);
        }

        var numbers   = [],
            numberRow = '';

        for(var i = 1;  i <= totalSlots; i += step) {
            numberRow +='<li>' + i +'</li>';
            numbers.push(i);
        }

        $dimensionData
            .find(this.options.sections.dimensionSlotRow)
            .append(numberRow);

        $('.dimemsion-slots-row').find('li').width(widthSlotRowStep);

        return step;
    },

    DrawExperiment: function(dimension, experiment, step) {

        var self = this,
            positionX,
            positionY,
            dimensionId  = dimension.id,
            experimentId = experiment.id,
            $dimension  = $('#'+dimensionId),
            $experiment = $('#'+experimentId),
            slotsRow     = experiment.slots,
            experimentName = $experiment.data('name'),
            dimensionData = $dimension.find(self.options.sections.dimensionData),
            dimensionInfo = $dimension.find(self.options.sections.dimensionInfo);

        dimensionInfo
            .append("<div class='experiment-name'>" + experimentName + "</div>");

        var canvasId = experimentId+'-canvas';

        $('<canvas></canvas>')
            .attr('id', canvasId)
            .appendTo(dimensionData);

        var canvas = document.getElementById(canvasId);

        canvas.width  = self.options.widths.data;
        canvas.height = self.options.slot.height;

        var slots = slotsRow.toString().split(',');

        $.each(slots, function(index, slot) {

            var drawPosition = {
                x: parseInt(slot),
                y: 0
            };

            // now actually draw!!
            self.DrawSlot(canvas,  drawPosition, step);
            self.UpdateDimensionCanvas(dimension, drawPosition, step);
        });
    },

    /**
     * Updates dimension global slot statistics
     * @param dimension
     * @param position
     * @param step
     */
    UpdateDimensionCanvas: function(dimension, position, step) {

        var x = this.options.widths.slotRowWidth * (position.x - 1) / step,
            y = position.y;

        var ctx = dimension.canvas.getContext('2d');

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.rect(x, y, 10, 30);
        ctx.closePath();
        ctx.fill();
    },

    /**
     * Draw filled candle Candle
     * @param position Object {x,y}
     */
    DrawSlot: function(canvas, position, step) {

        var x = this.options.widths.slotRowWidth * (position.x - 1) / step,
            y = position.y;

        var ctx = canvas.getContext('2d');

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.rect(x, y, this.options.slot.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
};