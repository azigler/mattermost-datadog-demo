import { USER_DEFAULTS } from "../utils"

export class Action {
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
