import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file
  app.get( "/filteredimage", async ( req, res ) => {
    const imageUrl = req.query.image_url;

    if(!imageUrl) return res.status(422).send('Unable to find image_url query parameter');

    try {
      const filepath = await filterImageFromURL(imageUrl);

      res.sendFile(filepath, async () => {
        await deleteLocalFiles([filepath]);
      });

    } catch (error) {
      res.status(422).send('An error occurred when trying to filter the image from the given url');
    }



  } );

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();