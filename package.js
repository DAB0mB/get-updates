Package.describe({
  name: "dab0mb:get-updates",
  summary: "A utility for getting mongo updates",
  version: "1.0.4",
  git: "https://github.com/DAB0mB/get-updates.git"
});

Package.onUse(function(api) {
  api.addFiles('client/get-updates.js');
  api.export('GetUpdates');
});