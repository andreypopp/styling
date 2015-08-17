import Style from './Button.style'

export default class Button {

  render() {
    return (
      <button className={Style.self}>
        <span className={Style.icon} />
        <span className={Style.caption}>
          {caption}
        </span>
      </button>
    )
  }
}
