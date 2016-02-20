$(function() {
  function MainVM(tenantServerBinding) {
    var self = this;
    self.tenantsData = ko.observableArray();

    self.addTenant = addTenant;
    self.removeTenant = removeTenant;
    self.saveTenant = saveTenant;
    self.isTenantDirty = isTenantDirty;

    function TenantUIModel(obj) {
      var self = this;

      if (!obj) {
        obj = {
          "id": "",
          "name": "",
          "edh": {
            "protocol": "",
            "hostname": "",
            "port": "",
            "method": ""
          },
          "key": ""
        };
      }

      _.assign(self, obj);

      self.id = ko.observable(self.id);
      self.name = ko.observable(self.name);
      self.key = ko.observable(self.key);
      self.edh.protocol = ko.observable(self.edh.protocol);
      self.edh.hostname = ko.observable(self.edh.hostname);
      self.edh.port = ko.observable(self.edh.port);
      self.edh.method = ko.observable(self.edh.method);

      self.edh.protocols = ko.observableArray(['http', 'https']);
      self.edh.methods = ko.observableArray(['GET', 'POST', 'PUT', 'DELETE']);

      self.dirty = ko.observable(false);
      self.isDirty = ko.computed(function() {
        self.id();
        self.name();
        self.key();
        self.edh.protocol();
        self.edh.hostname();
        self.edh.port();
        self.edh.method();

        self.dirty(true);
      });
      self.dirty(false);

      self.toServerModel = function() {
        return {
          "id": self.id(),
          "name": self.name(),
          "edh": {
            "protocol": self.edh.protocol(),
            "hostname": self.edh.hostname(),
            "port": self.edh.port(),
            "method": self.edh.method()
          },
          "key": self.key()
        };
      };
    }

    function addTenant() {
      self.tenantsData.push();
    }

    function removeTenant(index) {
      tenantServerBinding.remove(index);
    }

    function saveTenant(index){
      if ((index + 1) === self.tenantsData().length) {
        self.tenantsData.push(new TenantUIModel());
      }

      var t = self.tenantsData()[index];
      tenantServerBinding.save(index, t.toServerModel());
      t.dirty(false);
    }

    function isTenantDirty(obj, index) {
      console.log(obj, index);
      return _.isEqual(obj, tenantServerBinding.tenants()[index]);
    };

    function addOrUpdate(koArr, value, criteria) {
      var index = _.indexOf(koArr(), _.find(koArr(), criteria));

      if (index != -1) {
        koArr.splice(index, 1, value);
      } else {
        koArr.push(value);
      }
    }


    function init() {
      tenantServerBinding.tenants.subscribe(function(nV) {
        self.tenantsData(_.map(nV, function(tenantObject) {
          return new TenantUIModel(_.cloneDeep(tenantObject));
        }));

        var empty = new TenantUIModel();
        self.tenantsData.push(empty);
      });
    }

    init();
  }

  ko.applyBindings(new MainVM(new TenantServerBinding()));

  function TenantServerBinding() {
    var self = this;

    self.tenants = ko.observableArray();
    self.remove = remove;
    self.save = save;

    function remove(index) {
      self.tenants.splice(index, 1);
      saveTenantsToServer();
    }

    function save(i, obj) {
      self.tenants()[i] = obj;
      saveTenantsToServer();
    }

    function getTenants() {
      $.getJSON('/tenants', function(data) {
        _.each(data, function (v) {
          self.tenants.push(v);
        });
      });
    }

    function saveTenantsToServer() {
      var options = {
        url: '/tenants',
        type: 'POST',
        data: JSON.stringify(self.tenants()),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function() {
          console.log('success');
        }
      }

      $.ajax(options)
    }

    function init() {
      getTenants();
    }

    init();
  };
});


