import React from "react";

interface IProps {
  name: string;
}

interface IState {
  color: "red" | "blue"
}

export class Home extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      color: "red"
    }
  }
  public onClickColor = () => {
    const { color } = this.state;
    if (color === "red") {
      this.setState({
        color: "blue"
      });
    }
    if (color === "blue") {
      this.setState({
        color: "red"
      });
    }
  }
  public render() {
    const { name } = this.props;
    const { color } = this.state;
    return (
      <div>
        <span style={{ color }}>{ name }</span>
        <button onClick={this.onClickColor}>变颜色</button>
      </div>
    );
  }
}