import * as fs from "fs"
import * as path from "path"

const USER_DEFAULTS = {
  team: "main",
  channel: "example",
}

const MM_URL = "http://localhost:8065"

console.log("Rooster server online!")

function read(filepath: string, json = true) {
  let contents

  try {
    contents = fs.readFileSync(filepath, {
      encoding: "utf8",
    })
  } catch {
    contents = false
  }

  if (typeof contents == "string" && json) {
    return JSON.parse(contents)
  } else {
    return contents
  }
}

function matterFetch(endpoint: string, token: string) {
  const api = `${MM_URL}/api/v4/`
  fetch(`${api}${endpoint}`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  }).then((data) => {
    if (data.status === 200) {
      return data.text().then((final) => {
        return final
      })
    } else {
      return ""
    }
  })
}

async function matterFetch2(endpoint: string, token: string) {
  const api = `${MM_URL}/api/v4/`
  const data = await fetch(`${api}${endpoint}`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  })

  if (data.status === 200) {
    const text = await data.text()
    return text
  } else {
    return false
  }
}

class Action {
  type: string
  channel: string
  text: string

  constructor(props: Action) {
    this.type = props.type
    this.channel = props.channel || USER_DEFAULTS.channel
    this.text = props.text || ""

    if (this.text) {
    }
  }
}

class User {
  name: string
  token: string | false
  defaults:
    | {
        team: string
        channel: string
      }
    | false
  actions: Action[] | false

  constructor({ name }: { name: string }) {
    this.name = name
    const config = read(
      path.join(__dirname, `../data/users/${name}/config.json`)
    )
    const token = read(
      path.join(__dirname, `../data/users/${name}/token.txt`),
      false
    )

    if (config) {
      this.defaults = config.defaults || false
      if (!this.defaults) {
        this.defaults = USER_DEFAULTS
      }

      const actionBuffer = config.actions || false
      this.actions = []
      if (actionBuffer) {
        for (const a of actionBuffer) {
          this.actions.push(new Action(a))
        }
      }
    } else {
      this.defaults = false
      this.actions = false
    }

    if (token) {
      this.token = token
      // set prof pic

      this.fetchMe(token)
    } else {
      this.token = false
    }
  }

  async fetchMe(token: string) {
    console.log(await matterFetch2("users/me", token))
  }
}

const test = new User({
  name: "zeek",
})

/*

for user
  grab their config
  create a user in memory
  store their token
  if they have an avatar file, set as profile picture

User
  name
  token
  defaults
    team
    channel
  Action[]
    use user's default unless overridden
    for action's text, parse newlines and escape backticks, convert to string literal

*/
