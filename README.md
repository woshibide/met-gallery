# met museum collection api client (nuxt)

this project is a nuxt-based client for exploring the metropolitan museum of art's open access collection using only client-side api calls. it enables users to search, view, and learn about artworks, with a focus on images and descriptions, while respecting the public nature of the api.

## about the met collection api

- the met provides open access to over 470,000 artworks via a public rest api: https://metmuseum.github.io/
- no api key or registration is required
- all data and most images are released under creative commons zero (cc0)
- please limit requests to 80 per second to avoid overloading the service
- see the [terms and conditions](https://www.metmuseum.org/information/terms-and-conditions) for details

## main endpoints used

- `/public/collection/v1/search` — search for object ids by keyword, department, artist, medium, date, etc.
- `/public/collection/v1/objects/[objectID]` — fetch detailed info and images for a specific object
- `/public/collection/v1/departments` — get a list of departments (e.g. egyptian art)

## typical client workflow

1. search for objects using keywords and filters (e.g. department, has images)
2. retrieve object ids from the search results
3. fetch object details (title, description, images, artist, etc.) for each id
4. display results with images and metadata

## search examples

- search for 'cat' in egyptian art: `/search?departmentId=10&q=cat`
- search for objects with images: `/search?hasImages=true&q=sunflowers`
- search by artist or culture: `/search?artistOrCulture=true&q=french`

## respectful usage

- always keep request rates well below the 80/sec limit
- cache results where possible to reduce duplicate requests
- attribute the met and respect copyright for non-cc0 images
- do not expose sensitive or private user data

## development

- all api calls are made from the client/browser
- no backend proxy is used
- see the met api docs: https://metmuseum.github.io/

