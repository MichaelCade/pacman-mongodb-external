var service_host = '192.168.169.101'; 
var auth_details = 'mongoadmin:Passw0rd999!';
var mongo_database = 'pacman';
var mongo_port = '27017';
var use_ssl = false;
var validate_ssl = true;

var database = {
  url: `mongodb://${auth_details}@${service_host}:${mongo_port}/${mongo_database}?authSource=admin&replicaSet=rs&directConnection=true`,
  name: `${mongo_database}`,
  options: {
    readPreference: 'secondaryPreferred',
  }
};

if (use_ssl) {
  database.options.ssl = use_ssl;
  database.options.sslValidate = validate_ssl;
}

const _database = database;
export { _database as database };