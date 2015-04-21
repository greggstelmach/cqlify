module.exports = function() {


  var connection = require('./connection');
  var options = {
    connection: {
      contactPoints: connection.contactPoints,
      keyspace: connection.keyspace,
      policies: {},
      authProvider: connection.authProvider
    }
  };
  var cqlify = require('../../app')(options);

  var userModel = function() {
    var schema = {
      id: {
        type: cqlify.types.TIMEUUID,
        key_type: cqlify.types.PRIMARY_KEY,
        key_order: 1
      },
      first_name: {
        type: cqlify.types.TEXT,
        validators: [
          function(obj) {
            if(obj && obj.length != 5)
              return cqlify.util.constructValidationMessage(false, "Length is not 5!")

          }
        ]
      },
      address: {
        type: cqlify.types.TEXT
      },
      age: {
        type: cqlify.types.INT
      },
      isActive: {
        type: cqlify.types.BOOLEAN
      },
      nick_names: {
        type: cqlify.types.LIST,
        schema: {
          type: cqlify.types.TEXT
        }
      },
      phone_numbers: {
        type: cqlify.types.MAP,
        schema: {
          number_type: {
            type: cqlify.types.TEXT,
            key_type: cqlify.types.PRIMARY_KEY
          },
          phone_number: {
            type: cqlify.types.TEXT
          }
        }
      }
    };

    var model = cqlify.model(schema, {
      tableName: 'user'
    });

    model._pre(function(obj) {
      if(obj.isNew) {
        obj.id = cqlify.types.getTimeUuid().now();
      }
    });

    return model;
  };

  var user = new userModel();
  user.first_name = "Rober";
  user.age = 31;
  user.address = "some address";
  user.isActive = true;
  user.phone_numbers.addNew({number_type:"Home", phone_number:"234-234-3244"});
  user.phone_numbers.addNew({number_type:"Work", phone_number:"222-234-3244"});
  user.nick_names.addNew("Rob");
  user.nick_names.addNew("Bob");
  user.nick_names.addNew("Bobby");
  var isValid = user._validate();
  var json = JSON.stringify(user);
  user.insert(function(err, data) {
    console.log('err'+ err);
    var user_db = new userModel();
    user_db.find([{
      name:'id', value: user.id, comparer: cqlify.comparer.EQUALS
    }], function(err, data) {
      console.log(data[0].toObject())
    });


  });

}();