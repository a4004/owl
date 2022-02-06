# Owl OSS 🌐
Free and open-source all-in-one Discord management solution with extensive plugin support.

<p>
  <img alt="Build Passing" src="https://img.shields.io/static/v1?label=Build&message=Passing&color=limegreen&style=flat-square&logo=node.js&logoColor=white"/>
  <img alt="Alpha" src="https://img.shields.io/static/v1?label=Latest&message=0.1.4&color=blue&style=flat-square"/>
</p>

## What's New 🆕
- New script 💿️ `delete-slash-cmds.js` added. Learn more [here](https://github.com/a4004/owl/wiki) for usage.

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

## Creating Plugins 🧩
Owl OSS is in its early stages and does not have much functionality, but it provides the foundation for anyone to create their own functionality on top of the existing
code. There are no set rules on how you create plugins, but if you're willing to contribute to this OSS project, then ensure it follows a similar structure to the existing
`twttr-relay.js` plugin with an `init()` function. General advice would be to keep filenames and identifiers as short as possible and ensure your code is self-contained where possible. The sky is your limit.

### Currently Owl OSS has two plugins:
  - Twitter Relay Service `twttr-relay.js` designed to relay Tweets to Discord servers by using a local API endpoint (served by `express`) and a cloud notification provider such as If This Then That (IFTTT).
  - Noon `noon.js` a fun Discord chat game where the aim is to be the first person to talk during 00:00 (implemented for *Europe/London* timezone but can be changed to suit your needs).

## Legal 🧻
The software is provided **as is** without warranty of any kind. The developer, **shall not**, under **any circumstance** bear any form of **responsibility/authority or involvement** over consequences as a result of the operation/distribution/modification or other interaction with this open-source software. [Open source client notice](./FORCLIENTS.md).
