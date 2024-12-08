# <image src="https://what3words.com/assets/images/w3w_square_red.png" width="32" height="32"> &nbsp; what3words ArcGIS Experience Builder Widget


A custom widget for [ArcGIS Experience Builder](https://developers.arcgis.com/experience-builder//) providing reverse geocoding via the [what3words ArcGIS locator](https://developer.what3words.com/tools/gis-extensions/arcgis).
![Final ArcGIS Experience Builder - what3words widget](./docs/ScreenShot-01-show-final-widget.png)

## Demo App

You can find the Custom Web AppBuilder what3words widget in this [Github page](https://what3words.github.io/w3w-arcgis-experience-builder-widget/expBuilder_Widget/).

## Prerequisites
- An installed and configured instance of [ArcGIS Experience Builder (Developer Edition)](https://developers.arcgis.com/experience-builder/guide/install-guide/);
- A URL of your what3words ArcGIS Locator that has been added to your ArcGIS online or your Portal for ArcGIS by following this [instruction](https://developer.what3words.com/tools/gis-extensions/arcgis) on the what3words developer site;
- A copy of this widget `what3words`.

## Installation and Configuration

- Deploy the widget by copying the `what3words` folder and its contents into your ArcGIS Experience Builder installation's `client/your-extensions/widgets/` folder and restart your watcher;

- Run both [ArcGIS Experience Builder server](https://developers.arcgis.com/experience-builder/guide/install-guide/#server-install) and [ArcGIS Experience Builder client](https://developers.arcgis.com/experience-builder/guide/install-guide/#client-install) in 2 separate terminals;

- Create your [own Experience Application](https://developers.arcgis.com/experience-builder/guide/);

- Create your own experience application with a base map. You can now add the what3words widget to the map, on the side or whichever you prefer. You can search the `what3words` widget by typing its name on the search bar at the top of the list of widgets or looking for the widget on the list.

![Search widget](./docs/ScreenShot-02-search-w3w.png)

- Once you have found it you can drag and drop the widget onto your application whichever you prefer, next to map, on top of it or at the bottom of it. 
On the widget you can display the what3words address, the coordinates in WGS84, the zoom and copy buttons. 
On the Content panel of the widget on the right hand side, you have 3 sections:
    1. Select a map that you want your widget to work on;
    2. Set the what3words locator. Click on `Set Locator` and you will be able to select your what3words locator from the ArcGIS Online or your Portal for ArcGIS. 
    3. Display some widget options:
        - The Lat/Long coordinates options allows you to display the WGS84 coordinates of the related what3words address;
        - The Zoom button allows you to get to 5000m closer to the point on the map;
        - The Copy button allows you to copy the what3words to your clipboard;
        - With Popup message enabled you can display a popup message with the what3words address info above the map marker after tapping anywhere on the map.


![Drag and drop widget](./docs/ScreenShot-03-drag-and-drop-w3w.png)


- Configure the widget with your `what3words Locator URL`. By using the what3words locator, you would be able to retrieve the correct what3words address in any coordinate systems used on your web map.
Example of a what3words Locator: `https://utility.arcgis.com/usrsvcs/servers/<MyGeocodingArcGISUniqueID>/rest/services/what3words_EN_English/GeocodeServer`.

![Set Locator widget](./docs/ScreenShot-04-set-locator.png)

- To find the what3words Locator URL, go to your ArcGIS Online or Portal for ArcGIS, click on the `Content > My Organization` tab. Search for your locator, you could filter by `Item type > Tools > Locators` as shown on this screenshot:

![Locator in ArcGIS Online](./docs/ScreenShot-06-locator-arcgis-online.png)

- Then click on your Locator, scroll down to the bottom of the page, on the right-hand side, you will find the URL of your Locator. You need to *copy and paste this URL to the configuration page of the what3words widget*, as shown on this screenshot:

![Locator URL in ArcGIS Online](./docs/ScreenShot-07-arcgis-online-locator-url.png)

- The widget is now ready to run inside your Experience Builder app. Click on the map to retrieve the what3words address at the clicked location. For example, the point selected on the map returned this what3words address: `///filled.count.soap`.

![Final ArcGIS Experience Builder - what3words widget](./docs/ScreenShot-01-show-final-widget.png)

## Troubleshooting
If after installing correctly the what3words locator across your ArcGIS platform, you cannot display your what3words locator on your Experience app, it could be that your what3words locator hasn’t been put at the top of your `Geocoding services`.

To resolve this issue, please drag-and-drop the what3words locator at the top of the Geocoding service list, as it is shown on this screenshot. You can find this list under your `Organisation > Utility services > Geocoding section`. 
![Troubleshooting what3words locator display](./docs/ScreenShot-05-troubleshooting-w3w-locator.png)

To make it work with the @what3words/api, you need to add to your experience builder app this code snippet to the `widget-webpack-override.js` which is a file in `<Path-to-file>/ArcGISExperienceBuilder-v1.15/client/webpack/widget-webpack-override.js` in your ArcGIS experience builder app:

```js
const webpack = require('webpack');

module.exports = function (webpackConfig) {
  // Add fallbacks for Node.js core modules
  webpackConfig.resolve.fallback = {
    ...webpackConfig.resolve.fallback, // Preserve existing fallbacks
    os: require.resolve('os-browserify/browser'),
    stream: require.resolve('stream-browserify'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url'),
    zlib: require.resolve('browserify-zlib'),
    http: require.resolve('stream-http'),
  };

  // Add plugins to provide global variables for process and Buffer
  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  return webpackConfig;
};
```

and run the following npm install command

```bash
npm install os-browserify stream-browserify https-browserify url browserify-zlib stream-http process buffer --save-dev
```


## Issues

Find a bug or want to request a new feature? Please let us know by submitting an issue.

## Contributing
All contributions are welcome; please submit a pull request.

1. Fork it (http://github.com/what3words/w3w-arcgis-experience-builder-widget.git and click "Fork")
1. Create your feature branch (`git checkout -b my-new-feature`)
1. Commit your changes (`git commit -am 'Add some feature'`)
1. Don't forget to update README and bump [version](./lib/what3words/version.rb) using [semver](https://semver.org/)
1. Push to the branch (`git push origin my-new-feature`)
1. Create new Pull Request

## Revision History
* `v1.0.0`  - Add the locator to the ArcGIS Experience Builder
* `v.1.0.2` - Add a temporary fix to validate any Locator URLs
* `v.1.0.3` - Publish the app on a web server
* `v.1.0.4` - Fix bug - What3words widget can be displayed on maps with layers



## Feedback

We have a quick favor to ask. Would you mind heading to our app in the [what3words ArcGIS Online page](https://w3w.maps.arcgis.com/home/item.html?id=0150cfda08334003bec3a77e1006e8c6#overview) and writing a quick review?

Reviews help us keep up with your needs and they also help others like you to make confident decisions about our what3words applications.

Review or not, we still love you!

## Licensing

This widget is licensed under the MIT license. A copy of the license is available in the repository's [license](https://github.com/what3words/w3w-arcgis-webappbuilder-widget/blob/master/LICENSE) file.

