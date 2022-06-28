## 🚌 This project has moved to [Querty OSS](https://github.com/a4004/querty) 🚌
This repository is no longer maintained and is out of date, however a more recent and improved version exists under the new name *Querty* at [Querty OSS](https://github.com/a4004/querty). From now on, Owl OSS should be referred to under the new alias, *"Querty OSS"* to avoid confusion with the old, discontinued project.


### ⚠️ Advisory against project deployment ⚠️
This project has not been maintained for over 2 months and contains dependencies with critical security vulnerabilities. In addition, I now realise the project wasn't designed well and some functionality is buggy or doesn't work outright. I'm planning a full rewrite in TypeScript which will improve maintainability the project as a whole. The date/time when this will actually happen is TBD. In the meantime if you're thinking of using this project please ensure that you update the libraries and forgive me for the spaghetti code. 🙂

# Owl OSS 🌐
Free and open-source all-in-one Discord management solution with extensive plugin support.

<p>
  <img alt="Build N/A" src="https://img.shields.io/static/v1?label=Build&message=None&color=gray&style=flat-square&logo=node.js&logoColor=white"/>
  <img alt="Beta" src="https://img.shields.io/static/v1?label=Latest&message=0.1.4-r4&color=red&style=flat-square"/>
</p>

## What's New 🆕
- Fixed time zone conversion issue (discovered thanks to the clocks shifting). Now instead, uses local time of the server the bot is hosted on.

## Source Tree
```
- src 📁
      - cfg 📁
          - appcfg.json ⚙️
          - runcfg.json ⚙️
      - lib 📁
          - libcordapi.js 📦️
          - libowl.js 📦️
          - libsock.js 📦️
          - libtime.js 📦️
      - plugins 📁
          - noon.js 🧩
          - twttr-relay.js 🧩
      - scripts 📁
          - delete-slash-cmds.js 💿️
          - register-slash-cmds-noon.js 💿️
      - index.js 💾
```

## Get Started 🌀
1. Clone `a4004/owl` to your local git instance. `$ git clone https://github.com/a4004/owl.git`
2. Install Node.js dependencies. `owl/src/$ npm install`
3. Modify related configuration files. **Please note you will need to create your own Discord application on the [developer](https://discord.com/developers/) portal in order to obtain your own application token and client ID**.
4. Start Owl. `ow/src/$ node .`

Consult the [Wiki](https://github.com/a4004/owl/wiki) for additional information.

## Creating Plugins 🧩
Owl OSS is in its early stages and does not have much functionality, but it provides the foundation for anyone to create their own functionality on top of the existing
code. There are no set rules on how you create plugins, but if you're willing to contribute to this OSS project, then ensure it follows a similar structure to the existing
`twttr-relay.js` plugin with an `init()` function. General advice would be to keep filenames and identifiers as short as possible and ensure your code is self-contained where possible. The sky is your limit.

### Currently Owl OSS has two plugins:
  - Twitter Relay Service `twttr-relay.js` designed to relay Tweets to Discord servers by using a local API endpoint (served by `express`) and a cloud notification provider such as If This Then That (IFTTT).
  - Noon `noon.js` a fun Discord chat game where the aim is to be the first person to talk during 00:00 (implemented for *Europe/London* timezone but can be changed to suit your needs).

## Legal 🧻
The software is provided **as is** without warranty of any kind. The developer, **shall not**, under **any circumstance** bear any form of **responsibility/authority or involvement** over consequences as a result of the operation/distribution/modification or other interaction with this open-source software. [Open source client notice](./FORCLIENTS.md).
