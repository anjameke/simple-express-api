A simple node.js express API that connects to a mongoDB database.
Used a middleware function to obfuscate checking the validity of the user ID within the GET request.
Used the findOne function since the main endpoint is searching for a very specific user, and we can couple filtering against the ID and age requirement.