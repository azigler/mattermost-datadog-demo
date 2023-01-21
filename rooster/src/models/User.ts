import path from "path"
import {
  readUserFile,
  USER_DEFAULTS,
  POST_WAIT_SECONDS,
  matterGet,
  matterPut,
  matterPost,
  MM_URL,
} from "../utils"
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
        first_name?: string
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
    const me = await matterGet("users/me", token)
    if (me) {
      const data = JSON.parse(me)
      this.id = data.id

      if (this.avatar) {
        this.setAvatar()
      }

      if (this.defaults && this.defaults.first_name) {
        await matterPut(`users/${this.id}/patch`, token, {
          first_name: this.defaults.first_name,
        })
      }
    }

    if (this.actions && this.defaults) {
      let defaultTeam: any = await matterGet(
        `teams/name/${this.defaults.team}`,
        token
      )
      let defaultChannel: any

      if (defaultTeam) {
        defaultTeam = JSON.parse(defaultTeam).id

        defaultChannel = await matterGet(
          `teams/${defaultTeam}/channels/name/${this.defaults.channel}`,
          token
        )
        if (defaultChannel) {
          defaultChannel = JSON.parse(defaultChannel).id
        }
      }

      for (const act of this.actions) {
        let thisChannel: any
        if (act.channel) {
          thisChannel = await matterGet(
            `teams/${defaultTeam}/channels/name/${act.channel}`,
            token
          )
          if (thisChannel) {
            thisChannel = JSON.parse(thisChannel).id
          }
        } else {
          thisChannel = defaultChannel
        }

        function parseText(text: any) {
          let gpurl = ""
          exec(`gp url 8065`, (error, stdout, stderr) => {
            gpurl = stdout
          })

          let p = text.replace("${MM_URL}", gpurl)
          p = p.replace(
            "${PLAYBOOK_ATTACHMENT}",
            `
\`\`\`bash
{
  "attachments": [
      {
          "fallback": "$EVENT_MSG",
          "color": "#FF8000",
          "pretext": "This is optional pretext that shows above the attachment.",
          "text": "$EVENT_MSG",
          "author_name": "Datadog",
          "author_icon": "https://mattermost.com/wp-content/uploads/2022/02/icon_WS.png",
          "author_link": "https://mattermost.org/",
          "title": "🚨 $EVENT_TYPE",
          "title_link": "https://developers.mattermost.com/integrate/reference/message-attachments/",
          "fields": [
              {
                  "short":true,
                  "title":"Last Updated",
                  "value":"$LAST_UPDATED"
              },
              {
                  "short":true,
                  "title":"ID",
                  "value":"$ID"
              },
              {
                  "short":false,
                  "title":"Organization",
                  "value":"$ORG_NAME"
              }
          ],
          "image_url": "https://mattermost.com/wp-content/uploads/2022/02/icon_WS.png"
      }
  ]
}
\`\`\`
`
          )

          return p
        }

        let parsedActionText = parseText(act.text)

        switch (act.type) {
          case "post": {
            await matterPost("posts", token, {
              channel_id: thisChannel,
              message: parsedActionText,
            })
            await new Promise((resolve) =>
              setTimeout(resolve, POST_WAIT_SECONDS * 1000)
            )
            break
          }
          case "reaction-post": {
            const post = await matterPost("posts", token, {
              channel_id: thisChannel,
              message:
                parsedActionText +
                " React to this message with 👍 to continue.",
            })
            let interval: any
            if (post) {
              await new Promise((resolve) => {
                const checkForReaction = async () => {
                  const p = await matterGet(
                    `posts/${JSON.parse(post).id}`,
                    token
                  )
                  if (p) {
                    let parsed = JSON.parse(p)
                    if (parsed.metadata.reactions) {
                      clearInterval(interval)
                      resolve(parsed.metadata.reactions)
                    }
                  } else {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                  }
                }

                interval = setInterval(checkForReaction, 1000)
              })
            }
            break
          }
        }
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
