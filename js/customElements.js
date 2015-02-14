joint.shapes.html = {};
joint.shapes.html.Participant = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: 'html.Participant',
    attrs: {
      rect: {stroke: 'none', 'fill-opacity': 0}
    }
  }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.html.ParticipantView = joint.dia.ElementView.extend({
  template: [
    '<div class="participant-cell custom-element">',
    '<input class="participant" type="text"/>',
    '<input class="score" type="text"/>',
    '<label></label>',
    '</div>'
  ].join(''),

  initialize: function () {
    _.bindAll(this, 'updateBox');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);

    this.$box = $(_.template(this.template)());
    this.$participant = this.$box.find('.participant');
    this.$score = this.$box.find('.score');
    this.$label = this.$box.find('label');

    // Prevent paper from handling pointerdown.
    this.$box.find('input').on('mousedown click', function (evt) {
      evt.stopPropagation();
    });

    this.$participant.on('change', _.bind(function () {
      this.model.set('name', this.$participant.val());
    }, this));
    this.$participant.val(this.model.get('name'));

    this.$label.html(this.model.get('label'));

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this);
    this.updateBox();
  },
  render: function () {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.paper.$el.prepend(this.$box);
    this.updateBox();
    return this;
  },
  updateBox: function () {
    // Set the position and dimension of the box so that it covers the JointJS element.
    var bbox = this.model.getBBox();
    // Example of updating the HTML with a data stored in the cell model.
    this.$box.css({
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
      transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
    });
    this.$score.css({width: bbox.height});
    this.$participant.css({width: bbox.width - bbox.height});
  }
});