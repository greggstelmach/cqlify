var instance = require('./instance');
var _ = require('underscore');
var states = require('./states');
var child_container = require('./child_container');
var types = require('./types');
var model = function() {


};

model.prototype.hydrateModel = function(schema, cqlify, opts, fromObject, state) {
  opts || (opts = {});
  opts.fromObject = fromObject;
  var model = this.createModel(schema, cqlify, opts, states.UPDATE);
  model = new model();

  /*
  for (var property in schema) {
    if(fromObject[property]) {
      var schemaItem = schema[property];
      if(schemaItem.type === types.MAP) {
        for(var item in fromObject[property]) {
          var obj = fromObject[property][item];
          model[property].add(JSON.parse(obj));
        }
      }
      else if(schemaItem.type === types.LIST) {
        var arr= fromObject[property];
        for(var x = 0, len = arr.length; x < len; x++) {
          model[property].add(arr[x], state);
        }
      }
      else {
        model[property] = this.toObject(fromObject[property], schema[property]);
      }
    }
  }*/
  return model;
};

model.prototype.createChildModel = function(schema, parent, parentSchema) {
  var childModel = new child_container(schema, states.NEW, this,parent, parentSchema);
  return childModel;
};

model.prototype.createModel = function(schema, cqlify, opts, state) {
  var modelObj = this;
  var instanceObj = new instance();
  opts || (opts = {});
  var newInstance = instanceObj._compile(schema, cqlify, opts, state || states.NEW, modelObj);
  return newInstance;
};

model.prototype.toObject = function(prop, schema) {
  if(schema.type.toObject) {
    return schema.type.toObject(prop, schema.type, schema);
  }
  else
    return prop;
};


module.exports = new model();