// The single switch point for comic data.
//
// Components import from "services" and never from a specific provider.
// To move to a live API, create `apiProvider.js` exporting the same functions
// as `localProvider.js` and change the line below.
export * from './localProvider.js'
