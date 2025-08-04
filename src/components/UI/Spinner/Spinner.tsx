import style from './spinner.module.css';

type SpinnerProps = {
  style?: React.CSSProperties;
};
export function Spinner(props: SpinnerProps) {
  return <div style={props.style} className={style.spinner}></div>;
}
