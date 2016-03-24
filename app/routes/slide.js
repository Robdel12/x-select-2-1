import Ember from 'ember';
import presentation from '../presentation';

let $ = Ember.$;

export default Ember.Route.extend({
  announcer: Ember.inject.service('announcer'),

  init() {
    this._super.apply(this, arguments);

    this.get('announcer').set('message', "");
  },

  model(params) {
    var index = presentation.indexOf(params.id);

    if (index < 0) {
      throw new Error(`unknown slide: ${params.id}`);
    }
    return {
      index,
      slideTemplate: `slides/${params.id}`
    };
  },

  move(distance) {
    let currentIndex = this.get('controller.model.index');

    if(!presentation[currentIndex + distance]) {
      return;
    }

    this.transitionTo('slide', presentation[currentIndex + distance]);
  },

  activate() {
    $(window).on('keydown.SlideRoute', (e) => {
      switch (e.keyCode) {
      case 37:
        this.move(-1);
        break;
      case 39:
        this.move(1);
        break;
      case 33:
        this.move(-1); //Page down (presenter remote)
        break;
      case 34:
        this.move(1); //Page up (presenter remote)
      }
    });
  },

  deactivate() {
    $(window).off('keydown.SlideRoute');
  },

  actions: {
    moveForward() {
      this.move(1);
    },

    moveBackward() {
      this.move(-1);
    },

    selectBlurred(componet, value, event) {
      this.get('controller').setProperties({
        blurComponent: componet.get('elementId'),
        blurValue: value,
        blurEvent: event.type
      });
    }
  }
});
