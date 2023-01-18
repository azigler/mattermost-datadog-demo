import path from "path"
import { readUserFile, USER_DEFAULTS, matterFetch, MM_URL } from "../utils"
import { Action } from "."
import { exec } from "child_process"

export class User {
  name: string
  id: string
  avatar: Blob | false
  token: string | false
  defaults:
    | {
        team: string
        channel: string
        nickname?: string
      }
    | false
  actions: Action[] | false

  constructor({ name }: { name: string }) {
    this.name = name
    this.id = ""
    this.avatar = false

    const config = readUserFile(
      path.join(__dirname, `../../data/users/${name}/config.json`),
      "json"
    )
    const token = readUserFile(
      path.join(__dirname, `../../data/users/${name}/token.txt`)
    )
    this.avatar = readUserFile(
      path.join(__dirname, `../../data/users/${name}/avatar.png`)
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
      this.token = token.trim()
      this.fetchMe(token)
    } else {
      this.token = false
    }
  }

  async fetchMe(token: string) {
    const me = await matterFetch("users/me", token)
    if (me) {
      const data = JSON.parse(me)
      this.id = data.id

      if (this.avatar) {
        this.setAvatar()
      }

      if (this.defaults && this.defaults.nickname) {
        const nickname = await matterFetch(`users/${this.id}/patch`, token)
      }
    }
  }

  async setAvatar() {
    exec(
      `curl -F 'image=@./data/users/${this.name}/avatar.png' -H 'Authorization: Bearer ${this.token}' ${MM_URL}/api/v4/users/${this.id}/image`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
        }
        console.log(`stdout: ${stdout}`)
      }
    )
  }
}
