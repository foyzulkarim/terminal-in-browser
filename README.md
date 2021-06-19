# Terminal in browser
Welcome to the repo. 🙂
This is an adventurous project where I aimed to take inputs as terminal commands in browser and execute those commands in server, and through websocket protocol show the actual terminal updates into the browser in real time.
I have tested to executing multiple long-running commands from different browser in parallel, and verified each browser only receiving own command progress results. 

## Architecture diagram

![alt text](https://raw.githubusercontent.com/foyzulkarim/terminal-in-browser/main/terminal-in-browser.png)

## YouTube demo

[![Watch demo](https://user-images.githubusercontent.com/497812/122639706-e7f10d00-d12d-11eb-8b9f-e78456d3d58b.png)](https://www.youtube.com/embed/04YGW2zrjiY)

## Example output
  Execute terminal commands to your server from browser

```shell
> ping www.google.com

Pinging www.google.com [2404:6800:4001:808::2004] with 32 bytes of data:
Reply from 2404:6800:4001:808::2004: time=3ms 

Reply from 2404:6800:4001:808::2004: time=3ms 
Reply from 2404:6800:4001:808::2004: time=4ms 
Reply from 2404:6800:4001:808::2004: time=3ms 

Ping statistics for 2404:6800:4001:808::2004:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 3ms, Maximum = 4ms, Average = 3ms
Done
```

## Technology

- [x] TypeScript
- [x] Express.js
- [x] React.js
- [x] Special Node modules (`child_process`, `events` etc.)
- [x] Socket.io 
- [x] `terminal-in-react` npm library

## Installation and run the projects
 
 - Install server side packages and start server

```bash
$ npm install
$ npm start
```

 - Install client side packages and start client

```bash
$ cd client
$ yarn
$ yarn start
```

  View the website at: http://localhost:3000

  
## License

  [MIT](LICENSE)
