This site was started as a way for me to take pet projects that would normally only be run locally and put them on the world wide web. It came about as I began writing code again after a few years away from a text editor in an effort to prove that I still knew how to play with the ones and zeros that power many of our waking moments. As my confidence in my ability grows, I hope the size of these projects does as well.

The site is simple, and for good reason. It's a playground! Nothing here is meant for a production context in the truest sense of the word, but I've done my best to mimic a real-world setup. It's hosted on Google's public cloud using [Cloud Run](https://cloud.google.com/run/?hl=en) with our friends from [Cloudflare](https://www.cloudflare.com/) gamely resolving domain requests. The rest of the tech stack is as follows:

- [Docker](https://www.docker.com/) (providing the containerizing tech to make this stable to develop and launch)
- [Flask](https://flask.palletsprojects.com/en/3.0.x/) and [Jinja](https://jinja.palletsprojects.com/en/3.1.x/) (powering the back and front-end)
- [Gunicorn](https://gunicorn.org/) (making sure the back-end and front-end can actually be served)
- [Bootstrap](https://getbootstrap.com/) (making things look pretty)
- [React](https://react.dev/) and [Typescript](https://www.typescriptlang.org/) (when I want to make things act pretty)
- [GitHub](https://github.com/) and [GitHub Actions](https://github.com/features/actions) (getting the code from my machine to Google's)
- [Matplotlib](https://matplotlib.org/) (making charts on the server)
- [Recharts](https://recharts.org/en-US/) (making charts on the client)
- [Cloud Firestore](https://cloud.google.com/firestore?hl=en) (for anything NoSQL)

If you want to see some of the projects in action, [check out the homepage](/), and thanks for visiting!
