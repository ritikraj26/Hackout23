const express = require("express");
const axios = require("axios");
const app = express();
const port = 8000;

// Middleware for parsing JSON data
app.use(express.json());

// Middleware for enabling CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Define routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post('/api/login', (req, res) => {
    try {
      let { data } = req.body;
      let access_token = '';
      let user = {};
  
      axios
        .post('https://github.com/login/oauth/access_token', data, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then((response) => response.data)
        .then((data) => {
          console.log(data);
          access_token = data.access_token;
          
          axios
            .get('https://api.github.com/user', {
              headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${data.access_token}`,
                'X-GitHub-Api-Version': '2022-11-28',
              },
            })
            .then((response) => response.data)
            .then((data) => {
              console.log(data);
              user = {
                avatar: data.avatar_url,
                username: data.login,
              };
  
              res.json({ success: true, access_token, user });
            })
            .catch((error) => {
              console.error(error.message);
            });
        })
        .catch((error) => {
          console.error(error.message);
          res.json({ success: false, error });
        });
    } catch (er) {
      console.log(er.message);
      res.json({ success: false, error: er });
    }
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
