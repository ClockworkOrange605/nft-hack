# Creative Coding NFT's

A service that allows users to create their Creative Coding Artworks and publish them as NFT tokens.

## Running Dev Server

### Using Docker Compose

Make sure that `docker-compose` is installed and your user has the rights to run it:
```bash
$ sudo apt install docker-compose
$ sudo usermod -aG docker $USER
```

Copy .env file and configure your project:
```bash
$ cp .env.exapmle .env
$ nano .env
```

Run containers:
```
$ docker-compose up -d
```

Migrate contracts into your dev chain:
```bash
$ docker-compose exec rpc bash -c "npx truffle migrate"
```

Make sure that your .env file contain deployed contract address and recreate api container if you change config:
```bash
$ docker-compose up -d api
```

Make sure that api container has the necessary packages for media generation:
```bash
$ docker-compose exec api bash -c "apt update && apt install chromium ffmpeg"
```

Now you have your dev environment up and running and can develop