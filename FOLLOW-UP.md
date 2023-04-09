Implementation: 
Q) What libraries did you add to the application? What are they used for?
A)  dependencies as follows
    1. Fontawesome related depencies (@fortawesome/react-fontawesome, @fortawesome/free-solid-svg-icons, @fortawesome/fontawesome-svg-core) for using the Fontawesome icons in the app
    2. axios - to make required GET requests to the endpoint for song names
    3. gh-pages - to deploy the app on github pages
    4. node-sass, sass-loader - To be able to use scss for styling
    5. prop-types -  type validation for props to components 


Q) What's the command to start the application locally?
A) npm start (npm install & then npm start on first running the app locally)

General:

Q) If you had more time, what further improvements or new features would you add?
A)  
    1. MP3 Download link for each song

Q) Which parts are you most proud of? And why?
A) Unfortunately, I couldnt give my best within 2 hours duration due to time contraints and unexpected errors

Q) Which parts did you spend the most time with? What did you find most difficult?
A) 1. I spent more time on troubleshooing the issue where I could successfully generate the song url but when I make an api get request for that url, it would always return error Ex: "https://player.181fm.com/album.php?key=Jackie%20Deshannon%20-%20Do%20You%20Know%20How%20Christmas%20Trees%20Are%20Grown" url returns the correct data when requested in a diff tab but when requested from the app locally using axios it always returns an object {Image: "configs/images/noalbum-black.png", Title: "", error: "ref"}, because of which there is no song related image on the app

Q) How did you find the test overall? Did you have any issues or have difficulties completing? If you have any suggestions on how we can improve the test, we'd love to hear them.
A) I found the issue mentioned above and also noticed that github pages deployed version of my app didnt have expected result and threw the following error "Mixed Content: The page at 'https://afr2n.github.io/fm-radio-station/' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://listen.181fm.com:8443/ice_history.php?h=listen.181fm.com&https=&f=ice&p=7080&i=181-90sdance_128k.mp3&c=926825'. This request has been blocked; the content must be served over HTTPS." It worked fine locally because it was on HTTP. I spent sometime trying to fix these two issues assuming it could be an issue from my end hence spent more time on these issues instead of writing more tests and adding more animations to the current state of the app. 